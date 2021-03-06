import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/prismaClient";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
	req:NextApiRequest, res:NextApiResponse<IResponseType>
){
	if(req.method === "GET") {
		const {
      query: { page },
    } = req;
    const pageSize = 10;
    const currentPage = page ? +page - 1 : 0;
    const totalRecord = await client.stream.count();
    const maxPage = Math.ceil(totalRecord / pageSize);
    const products = await client.product.findMany({
      take: 10,
      skip: currentPage * pageSize,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });
    res.json({
      ok: true,
      products,
      maxPage,
    });
	}
	if(req.method === "POST") {
		const {
      body: { name, price, description, photoId },
      session: { user },
    } = req;
    const product = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        imageUrl: photoId,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
		const profile = await client.user.findUnique({
			where: { id: req.session.user?.id }
		})
		res.status(200).json({
			ok: true,
			product,
		});
	}
}

export default withApiSession(withHandler({
	methods: ["GET", "POST"],
	fn: handler,
	isPrivate: true
}));