import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/prismaClient";

export default async function handler(
	req:NextApiRequest, res:NextApiResponse
){
	await client.user.create({
		data: {
			email: "hi",
			name: "MMR"
		}
	});
	res.json({
		ok: true
	})
}