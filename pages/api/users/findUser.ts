import { NextApiRequest, NextApiResponse } from "next";
// import { PrismaClient } from "@prisma/client";
import prisma from "../../../db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    /* Used for requesting the data from a particular subreddit
      Basically says find the unqie set of data for a particular
      subreddit where the subreddit 'name' is equal to the url 
      value passed by (req.query.name). This (req.query.name) is
      the same 'name' that was passed as a (?) request in the SSR
      fetch from '[sub].tsx'. Also included is the array of posts 
      that within them contain the naem of the subreddit and user 
      to which they belong.
    */
    const user = await prisma.user.findUnique({
      where: { id: String(req.query.id) },
    //   include: {

    //   },
    });

    if (!user) {
      return res.status(500).json({ error: "No such user was found" });
    }

    // This returns the data content of a subreddit to the SSR async funtion in '[sub].tsx'
    res.json(user);
  } catch (error) {
    res.json(error);
  }
};

export default handler;
