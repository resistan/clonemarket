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
  const post = await client.post.findUnique({
    where: { id: +id.toString() },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      answers: {
        select: {
          answer: true,
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
      _count: {
        select: {
          answers: true,
          wonderings: true,
        },
      },
    },
  });

  const isWonder = Boolean(
    await client.wondering.findFirst({
      where: {
        postId: post?.id,
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );
  if (post) {
    res.json({
      ok: true,
      post,
      isWonder,
    });
  } else {
    res.json({
      ok: false,
      error: "404",
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    fn: handler,
  })
);
