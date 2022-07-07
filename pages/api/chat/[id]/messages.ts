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
    body,
    session: { user },
  } = req;
  const message = await client.chatMessage.create({
    data: {
      message: body.message,
      chat: {
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
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    fn: handler,
    isPrivate: true,
  })
);
