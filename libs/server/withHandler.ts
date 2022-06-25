import { NextApiRequest, NextApiResponse } from "next";

export interface IResponseType {
	ok: boolean;
	[key: string]: any;
}

export default function withHandler(
		method:"GET"|"POST"|"DELETE"|"UPDATE",
		fn: (req:NextApiRequest, res:NextApiResponse) => void
	) {
	return async function(req:NextApiRequest, res:NextApiResponse) : Promise<any> {
		if(req.method !== method) {
			res.status(405).end();
		}
		try {
			await fn(req, res);
		} catch (error) {
			console.log(error)
			return res.status(500).json({error});
		}
	}
}