import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/prismaClient";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
	req:NextApiRequest, res:NextApiResponse<IResponseType>
){
	const { query: { id }, session: { user } } = req;
	const alreadyExists = await client.likes.findFirst({
    where: {
      productId: +id.toString(),
      userId: user?.id,
    },
  });
	const product = await client.product.findUnique({
    where: { id: +id.toString() },
  });
  if (!product) {
    res.json({
      ok: false,
      error: "not found",
    });
  }
	if(alreadyExists) {
		// delete -- need id
		await client.likes.delete({
			where: {
				id: alreadyExists.id
			}
		});
		// if there isn't unique field
		// await client.likes.deleteMany({
		// 	where: {
		// 		userId: user.id
		// 	}
		// });
	} else {
		// create
		await client.likes.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        product: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    });
	}
	res.json({
		ok: true,
	})
}

export default withApiSession(withHandler({
	methods: ["POST"],
	fn: handler
}));