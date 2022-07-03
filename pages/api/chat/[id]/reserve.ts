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
  } = req;
  const contract = await client.chat.findUnique({
    where: {
      id: +id.toString(),
    },
    select: {
      productId: true,
      status: true,
    },
  });
  // console.log(contract);
  // const product = await client.product.update({
  //   where: {
  //     id: contract.productId,
  //   },
  // });
  // console.log(product);
  let reservation;
  if (contract?.status === "none" || contract?.status === "cancelled") {
    reservation = "reserved";
    await client.product.update({
      where: {
        id: contract.productId,
      },
      data: {
        status: 1,
      },
    });
  } else if (contract?.status === "reserved") {
    reservation = "cancelled";
    await client.product.update({
      where: {
        id: contract.productId,
      },
      data: {
        status: 0,
      },
    });
  }
  await client.chat.update({
    where: {
      id: +id.toString(),
    },
    data: {
      status: reservation,
    },
  });
  // console.log(chat);
  res.json({
    ok: true,
    reservation,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    fn: handler,
  })
);
