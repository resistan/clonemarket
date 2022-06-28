import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/prismaClient";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  if (req.method === "GET") {
    const streams = await client.stream.findMany({});
    res.json({
      ok: true,
      streams,
    });
  }
  if (req.method === "POST") {
    const {
      body: { name, price, description },
      session: { user },
    } = req;
    const stream = await client.stream.create({
      data: {
        name,
        price: +price,
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    const profile = await client.user.findUnique({
      where: { id: req.session.user?.id },
    });
    res.status(200).json({
      ok: true,
      stream,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    fn: handler,
    isPrivate: true,
  })
);
