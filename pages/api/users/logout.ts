import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/prismaClient";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { withIronSessionApiRoute } from "iron-session/next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
	req:NextApiRequest, res:NextApiResponse<IResponseType>
){
	// console.log(req.session);

	req.session.user = undefined;
	await req.session.destroy();
	res.status(200).json({ ok: true });
}

export default withApiSession(withHandler({
	methods: ["POST"],
	fn: handler,
	isPrivate: false
}))