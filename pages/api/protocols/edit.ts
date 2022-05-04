import prisma from "../../../db";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { protocol } = req.body;
  const session = await getSession({ req });

  if (!session) {
    return res.status(500).json({ error: "You have to be logged in" });
  }

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
  

    // Deleted previous Products. Adds old and new ones back
    const updatedProtocol = await prisma.$transaction(
      [
        prisma.protocol.update({
          where: {id: protocol.id},
          data: {
              body: protocol.body,
              products: {
                  set: [],
              },
          },
      }),
        prisma.protocol.update({
          where: {id: protocol.id},
          data: {
              body: protocol.body,
              products: {
                  create: protocol.products,
              },
          },
      })
      ]
    );

    return res.json(updatedProtocol);
  } catch (e) {
      console.log(e);
    return res.status(500).json({ error: e });
  }
};

export default handler;
