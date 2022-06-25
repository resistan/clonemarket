import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/prismaClient";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { withIronSessionApiRoute } from "iron-session/next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
	req:NextApiRequest, res:NextApiResponse<IResponseType>
){
	console.log(req.session);
	const { token } = req.body;
	const foundToken = await client.token.findUnique({
		where: {
			payload: token,
		},
		// include: { user: true }
	});
	// console.log(foundToken)
	if(!foundToken) return res.status(404).end();
	req.session.user = {
		id: foundToken.userId
	}
	await req.session.save();
	await client.token.deleteMany({
		where: { userId: foundToken.userId }
	})
	res.status(200).json({ ok: true });
}

export default withApiSession(withHandler({
	method: "POST",
	fn: handler,
	isPrivate: false
}))