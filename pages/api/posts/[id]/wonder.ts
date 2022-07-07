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
    where: { id: +id!.toString() },
  });
  if (!post) {
    res.json({
      ok: false,
      error: "not found",
    });
  }
  const alreadyExists = await client.wondering.findFirst({
    where: {
      postId: +id!.toString(),
      userId: user?.id,
    },
  });
  if (alreadyExists) {
    await client.wondering.delete({
      where: {
        id: alreadyExists.id,
      },
      select: {
        id: true,
      },
    });
  } else {
    await client.wondering.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        post: {
          connect: {
            id: +id!.toString(),
          },
        },
      },
    });
  }
  res.json({
    ok: true,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    fn: handler,
  })
);
