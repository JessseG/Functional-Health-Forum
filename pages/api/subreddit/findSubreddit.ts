import { NextApiRequest, NextApiResponse } from "next";
// import { PrismaClient } from "@prisma/client";
import prisma from "../../../db";

/*
  This findSubreddit will be called from [sub].tsx in order to
  find a particular subreddit and request its unique data. The
  request will be made using SSR in the follow format:
  
  export async function getServerSideProps(ctx) {

    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/subreddit/findSubreddit?name=${ctx.query.sub}`
    );
    const fullSub = await res.json();

    return {
      props: {
        fullSub,
      },
    };
  }
*/

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
    const sub = await prisma.subreddit.findUnique({
      where: { name: String(req.query.name) },
      include: {
        posts: {
          include: {
            subreddit: true,
            user: true,
            comments: {
              include: {
                user: true,
              },
            },
            votes: true,
          },
        },
        joinedUsers: true,
        protocols: {
          include: {
            subreddit: true,
            user: true,
            comments: {
              include: {
                user: true,
              },
            },
            products: true,
            votes: true,
          },
        },
      },
    });
    // console.log(sub);

    if (!sub) {
      return res.status(500).json({ error: "No such sub was found" });
    }

    // This returns the data content of a subreddit to the SSR async funtion in '[sub].tsx'
    res.json(sub);
  } catch (error) {
    res.json(error);
  }
};

export default handler;
