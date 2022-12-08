import prisma from "../../../db";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { protocol } = req.body;
  // const session = await getSession({ req });

  // console.log(session);

  // if (!session) {
  //   return res.status(500).json({ error: "You have to be logged in" });
  // }

  //   console.log("Inside API: ", protocol.products);
  try {
    // Modifies actual old products but isnt able to add new ones to products scalar list???
    // const updatedProtocol1 = await prisma.protocol.update({
    //     where: {id: protocol.id},
    //     data: {
    //         body: protocol.body,
    //         products: {
    //             upsert: protocol.products,
    //         },
    //     },
    // });

    let updateSteps = [];

    // if PRODUCTS CHANGED and BODY CHANGED
    if (!protocol.productsSame && !protocol.bodySame) {
      updateSteps.push(
        prisma.product.deleteMany({
          where: { protocolId: protocol.id },
        }),
        prisma.protocol.update({
          where: { id: protocol.id },
          data: {
            body: protocol.body,
            products: {
              create: protocol.products,
            },
          },
        })
      );
    }
    // if PRODUCTS CHANGED but BODY SAME
    else if (!protocol.productsSame && protocol.bodySame) {
      updateSteps.push(
        prisma.product.deleteMany({
          where: { protocolId: protocol.id },
        }),
        prisma.protocol.update({
          where: { id: protocol.id },
          data: {
            products: {
              create: protocol.products,
            },
          },
        })
      );
    }
    // if PRODUCTS SAME but BODY CHANGED
    else if (protocol.productsSame && !protocol.bodySame) {
      updateSteps.push(
        prisma.protocol.update({
          where: { id: protocol.id },
          data: {
            body: protocol.body,
          },
        })
      );
    }

    // Deleted previous Products. Adds old and new ones back
    const updatedProtocol = await prisma.$transaction(updateSteps);

    return res.json(updatedProtocol);
  } catch (e) {
    // console.log(e);
    return res.status(500).json({ error: e });
  }
};

export default handler;
