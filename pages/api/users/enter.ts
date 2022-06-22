import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler from "@libs/server/withHandler";


async function handler(
	req:NextApiRequest, res:NextApiResponse
){
	const { email, phone } = req.body;
	// console.log(email)
	return res.status(200).end();
}

export default withHandler("POST", handler)