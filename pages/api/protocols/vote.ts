// import { PrismaClient } from "@prisma/client";
import prisma from "../../../db";
import { getSession } from "next-auth/react";

// const prisma = new PrismaClient({ log: ["error"] });

const handler = async (req, res) => {
  const session = await getSession({ req });
  const { protocolId } = req.body;
  const { type } = req.body;

  if (!session) {
    return res.status(500).json({ error: "You have to be logged in" });
  }

  // get all votes from user
  try {
    const votes = await prisma.protocol_Vote.findMany({
      where: {
        userId: session.userId,
      },
    });

    // check if user has already voted
    const hasVoted = votes.find((vote) => vote.protocolId === protocolId);

    // if they voted, then remove the previous vote
    if (hasVoted) {
      // if user has voted & voteType is different - change voteType

      if (hasVoted.voteType !== type) {
        const updatedVote = await prisma.protocol_Vote.update({
          where: {
            id: Number(hasVoted.id),
          },
          data: {
            voteType: type,
          },
        });
        return res.json(updatedVote);
      }

      const deletedVote = await prisma.protocol_Vote.delete({
        where: {
          id: Number(hasVoted.id),
        },
      });
      return res.json(deletedVote);
    }

    // otherwise just create a new vote and return it
    const newVote = await prisma.protocol_Vote.create({
      data: {
        voteType: type,
        user: {
          connect: { id: String(session.userId) },
        },
        protocol: {
          connect: { id: Number(protocolId) },
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
