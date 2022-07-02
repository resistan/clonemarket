import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/prismaClient";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  if (req.method === "GET") {
    const {
      query: { page },
    } = req;
    const pageSize = 10;
    const currentPage = page ? +page - 1 : 0;
    const totalRecord = await client.chat.count();
    const maxPage = Math.ceil(totalRecord / pageSize);
    const chats = await client.chat.findMany({
      take: 10,
      skip: currentPage * pageSize,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
    res.json({
      ok: true,
      chats,
      maxPage,
    });
  }
  if (req.method === "POST") {
    const {
      body: { product },
      session: { user },
    } = req;
    // console.log(product, user);
    const alreadyExists = await client.chat.findMany({
      where: {
        buyerId: user?.id,
        productId: product.id,
      },
    });
    if (alreadyExists) {
      // console.log(alreadyExists);
      res.status(200).json({
        ok: true,
        chat: alreadyExists,
      });
    } else {
      const chatItem = await client.chat.create({
        data: {
          buyer: {
            connect: {
              id: user?.id,
            },
          },
          seller: {
            connect: {
              id: product.user.id,
            },
          },
          product: {
            connect: {
              id: product.id,
            },
          },
        },
      });
      // console.log(chatItem);
      res.status(200).json({
        ok: true,
        chat: chatItem,
      });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    fn: handler,
    isPrivate: true,
  })
);
