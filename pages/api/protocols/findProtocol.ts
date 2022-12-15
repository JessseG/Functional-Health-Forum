import { NextApiRequest, NextApiResponse } from "next";
// import { PrismaClient } from "@prisma/client";
import prisma from "../../../db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.body;

    /* Used for requesting the data from a particular community
      Basically says find the unqie set of data for a particular
      community where the community 'name' is equal to the url 
      value passed by (req.query.name). This (req.query.name) is
      the same 'name' that was passed as a (?) request in the SSR
      fetch from '[com].tsx'. Also included is the array of posts 
      that within them contain the naem of the community and user 
      to which they belong.
    */

    const protocol = await prisma.protocol.findUnique({
      where: {
        id: req.query.id !== undefined ? String(req.query.id) : id,
      },
      include: {
        products: true,
        comments: {
          include: {
            user: true,
            votes: true,
          },
        },
        community: true,
        user: true,
        votes: true,
      },
    });

    // if (!protocol) {
    //   return res.status(500).json({ error: "No such protocol was found" });
    // }

    // This returns the data content of a community to the SSR async funtion in '[com].tsx'
    return res.json(protocol);
  } catch (error) {
    return res.json(error);
  }
};

export default handler;
