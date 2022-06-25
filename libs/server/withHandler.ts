import { NextApiRequest, NextApiResponse } from "next";

export interface IResponseType {
	ok: boolean;
	[key: string]: any;
}

type method = "GET"|"POST"|"DELETE";

interface IConfig {
	methods: method[];
	fn: (req:NextApiRequest, res:NextApiResponse) => void;
	isPrivate?: boolean;
}

export default function withHandler({methods, isPrivate = true, fn}: IConfig) {
	return async function(req:NextApiRequest, res:NextApiResponse) : Promise<any> {
		if(req.method && !methods.includes(req.method as any)) {
			res.status(405).end();
		}
		if(isPrivate && !req.session.user) {
			return res.status(401).json({ ok: false, "error": "Please Log in" })
		}
		try {
			await fn(req, res);
		} catch (error) {
			console.log(error)
			return res.status(500).json({error});
		}
	}
}