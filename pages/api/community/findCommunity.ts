import { NextApiRequest, NextApiResponse } from "next";
// import { PrismaClient } from "@prisma/client";
import prisma from "../../../db";

/*
  This findCommunity will be called from [com].tsx in order to
  find a particular community and request its unique data. The
  request will be made using SSR in the follow format:
  
  export async function getServerSideProps(ctx) {

    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/community/findCommunity?name=${ctx.query.com}`
    );
    const fullCom = await res.json();

    return {
      props: {
        fullCom,
      },
    };
  }
*/

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    /* Used for requesting the data from a particular community
      Basically says find the unqie set of data for a particular
      community where the community 'name' is equal to the url 
      value passed by (req.query.name). This (req.query.name) is
      the same 'name' that was passed as a (?) request in the SSR
      fetch from '[com].tsx'. Also included is the array of posts 
      that within them contain the naem of the community and user 
      to which they belong.
    */
    const com = await prisma.community.findUnique({
      where: { name: String(req.query.name) },
      include: {
        posts: {
          include: {
            community: true,
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
            community: true,
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

    if (!com) {
      return res.status(500).json({ error: "No such community was found" });
    }

    // This returns the data content of a community to the SSR async funtion in '[com].tsx'
    res.json(com);
  } catch (error) {
    res.json(error);
  }
};

export default handler;
