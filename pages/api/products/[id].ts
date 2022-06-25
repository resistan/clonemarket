import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/prismaClient";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
	req:NextApiRequest, res:NextApiResponse<IResponseType>
){
	const { id } = req.query;
	const product = await client.product.findUnique({
		where: { id: +id },
		include: { user: {
			select: {
				id: true,
				name: true,
				avatar: true,
			}
		}}
	});
	// console.log(product)
	const terms = product?.name.split(" ").map( (word) => ({
		name: {
			contains: word,
		},
	}) );
	// console.log(terms)
	const relatedProducts = await client.product.findMany({
		where: {
			OR: terms,
			AND: {
				id: {
					not: product?.id,
				}
			}
		}
	})
	res.json({
		ok: true,
		product,
		relatedProducts
	})
}

export default withApiSession(withHandler({
	methods: ["GET"],
	fn: handler,
	isPrivate: true
}));