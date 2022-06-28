import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/prismaClient";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const {
    session: { user },
  } = req;
  const likes = await client.likes.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      product: {
        include: {
          _count: {
            select: {
              likes: true,
            },
          },
        },
      },
    },
  });

  res.status(200).json({
    ok: true,
    likes,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    fn: handler,
    isPrivate: true,
  })
);
