import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/prismaClient";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;
  const chat = await client.chat.findUnique({
    where: { id: +id.toString() },
    include: {
      chatMessages: {
        select: {
          id: true,
          message: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
      buyer: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
      seller: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  // console.log(chat);
  res.json({
    ok: true,
    chat,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    fn: handler,
  })
);
