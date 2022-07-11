// import { PrismaClient } from "@prisma/client";
import prisma from "../../../db";
import { getSession } from "next-auth/react";

// const prisma = new PrismaClient({ log: ["error"] });

const handler = async (req, res) => {
  const session = await getSession({ req });
  const { postId } = req.body;
  const { type } = req.body;

  if (!session) {
    return res.status(500).json({ error: "You have to be logged in" });
  }

  // get all votes from user
  try {
    const votes = await prisma.post_Vote.findMany({
      where: {
        userId: session.userId,
      },
    });

    // check if user has already voted
    const hasVoted = votes.find((vote) => vote.postId === postId);

    // if they voted, then remove the previous vote
    if (hasVoted) {
      // if user has voted & voteType is different - change voteType

      if (hasVoted.voteType !== type) {
        const updatedVote = await prisma.post_Vote.update({
          where: {
            id: Number(hasVoted.id),
          },
          data: {
            voteType: type,
          },
        });
        return res.json(updatedVote);
      }

      const deletedVote = await prisma.post_Vote.delete({
        where: {
          id: Number(hasVoted.id),
        },
      });
      return res.json(deletedVote);
    }

    // otherwise just create a new vote and return it
    const newVote = await prisma.post_Vote.create({
      data: {
        voteType: type,
        user: {
          connect: { id: String(session.userId) },
        },
        post: {
          connect: { id: postId },
        },
      },
    });

    return res.json(newVote);
  } catch (e) {
    // console.log(e);
    return res.status(500).json({ error: e });

  }
};

export default handler;

// NOTES: Chnaged vote to post_Vote
