import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/prismaClient";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const {
    body: { answer },
    session: { user },
    query: { id },
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
  const newAnswer = await client.answer.create({
    data: {
      answer,
      post: {
        connect: {
          id: +id!.toString(),
        },
      },
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });
  await res.revalidate(`/community/${id}`);
  res.status(200).json({
    ok: true,
    answer: newAnswer,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    fn: handler,
    isPrivate: true,
  })
);
