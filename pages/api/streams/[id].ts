import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/prismaClient";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;
  const stream = await client.stream.findUnique({
    where: { id: +id.toString() },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  if (!stream) {
    res.json({
      ok: false,
      error: "404",
    });
  }
  res.json({
    ok: true,
    stream,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    fn: handler,
  })
);
