import twilio from "twilio";
import Mailgun from "mailgun-js";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/prismaClient";
import withHandler, { IResponseType } from "@libs/server/withHandler";

const mailgun = Mailgun({ apiKey: process.env.MAILGUN_APIKEY!, domain: process.env.MAIL_DOMAIN! })
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
	req:NextApiRequest, res:NextApiResponse<IResponseType>
){
	const { email, phone } = req.body;
	const user = phone ? { phone } : email ? { email } : null;
	if (!user) return res.status(400).json({ok:false});
	const payload = Math.floor(100000 + Math.random() * 900000) + "";
	// upsert = update + insert
	// const user = await client.user.upsert({
	// 	where: {
	// 		...payload
	// 	},
	// 	create: {
	// 		name: "Anonymous",
	// 		...payload
	// 	},
	// 	update: {},
	// })
	const token = await client.token.create({
		data: {
			payload,
			user: {
				connectOrCreate: {
					where: {
						...user
					},
					create: {
						name: "Anonymous",
						...user
					}
				}
			}
		}
	});

	// send token
	// if(phone) {
	// 	const message = await twilioClient.messages.create({
	// 		messagingServiceSid: process.env.TWILIO_MSID,
	// 		// to: `+82${phone}`,
	// 		to: process.env.MY_PHONE!, // test code
	// 		body: `Your login token is ${payload}`,
	// 	});
	// 	console.log(message);
	// } else if(email) {
	// 	const data = {
	// 		from: 'clonemarket study<resistan@gmail.com>',
	// 		// to: user,
	// 		to: 'resistan@gmail.com', // test code
	// 		subject: `Veryfication email test.`,
	// 		text: `Mail send test. Your token is ${payload}`
	// 	}
	// 	const email = await mailgun.messages().send(data, function(error, body){
	// 		console.log(body);
	// 	});
	// 	console.log(email);
	// }
	// console.log("ok")
	return res.json({
		ok: true,
	});
}

export default withHandler({
	methods: ["POST"],
	fn: handler,
	isPrivate: false
})