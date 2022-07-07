import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import client from "@libs/server/prismaClient";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  if (req.method === "POST") {
    const {
      body: { question, latitude, longitude },
      session: { user },
    } = req;
    const post = await client.post.create({
      data: {
        question,
        latitude,
        longitude,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    await res.revalidate("/community");
    res.json({
      ok: true,
      post,
    });
  }
  if (req.method === "GET") {
    const {
      query: { latitude, longitude },
    } = req;
    let positionOps = {};
    if (latitude && longitude) {
      const parsedLatitude = parseFloat(latitude.toString());
      const parsedLongitue = parseFloat(longitude.toString());
      positionOps = {
        latitude: {
          gte: parsedLatitude - 0.01,
          lte: parsedLatitude + 0.01,
        },
        longitude: {
          gte: parsedLongitue - 0.01,
          lte: parsedLongitue + 0.01,
        },
      };
    }
    const posts = await client.post.findMany({
      take: 10,
      skip: 0,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            wonderings: true,
            answers: true,
          },
        },
      },
      where: positionOps,
    });

    res.json({
      ok: true,
      posts,
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
