import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/prismaClient";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  if (req.method === "GET") {
    const {
      query: { page },
    } = req;
    const pageSize = 10;
    const currentPage = page ? +page - 1 : 0;
    const totalRecord = await client.stream.count();
    const maxPage = Math.ceil(totalRecord / pageSize);
    const streams = await client.stream.findMany({
      take: 10,
      skip: currentPage * pageSize,
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json({
      ok: true,
      streams,
      maxPage,
    });
  }
  if (req.method === "POST") {
    const {
      body: { name, price, description },
      session: { user },
    } = req;
    const {
      result: {
        uid,
        rtmps: { streamKey, url },
      },
    } = await(
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT}/stream/live_input`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.CF_STEAM_TOKEN}`,
          },
          body: `{"meta": {"name":"${name}"},"recording": { "mode": "automatic", "timeoutSeconds": 10}}`,
        }
      )
    ).json();
    const stream = await client.stream.create({
      data: {
        cfId: uid,
        cfKey: streamKey,
        cfUrl: url,
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
