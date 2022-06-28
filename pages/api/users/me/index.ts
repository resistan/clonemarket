import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/prismaClient";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
	req:NextApiRequest, res:NextApiResponse<IResponseType>
){
	const profile = await client.user.findUnique({
		where: { id: req.session.user?.id }
	})
	res.status(200).json({
		ok: true,
		profile
	});
}

export default withApiSession(withHandler({
	methods: ["GET"],
	fn: handler,
	isPrivate: true
}));