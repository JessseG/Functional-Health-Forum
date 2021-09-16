import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  // get post id from 'req.body'
  // const postId = req.body.postId;
  const session = await getSession({ req });
  const { postId } = req.body;
  const { type } = req.body;

  //   console.log("post id and type", postId, type);
  //   console.log("the session", session);

  if (!session) {
    return res.status(500).json({ error: "You have to be logged in" });
  }

  // get all votes from user
  try {
    const votes = await prisma.vote.findMany({
      where: {
        userId: session.userId,
      },
    });

    // check if user has already voted
    const hasVoted = votes.find((vote) => vote.postId === postId);

    // if they voted, then remove the previous vote
    if (hasVoted) {
      const deletedVote = await prisma.vote.delete({
        where: {
          id: Number(hasVoted.id),
        },
      });
      return res.json(deletedVote);
    }

    // otherwise just create a new vote and return it
    const newVote = await prisma.vote.create({
      data: {
        voteType: type,
        user: {
          connect: { id: Number(session.userId) },
        },
        post: {
          connect: { id: Number(postId) },
        },
      },
    });

    return res.json(newVote);
  } catch (e) {
    console.log("The error is: ", e);
    res.json(e);
  }
};

export default handler;
