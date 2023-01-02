// import { PrismaClient } from "@prisma/client";
import prisma from "../../../db";
import { getSession } from "next-auth/react";

// const prisma = new PrismaClient({ log: ["error"] });

const handler = async (req, res) => {
  const session = await getSession({ req });
  const { protocolId } = req.body;
  const { voteId } = req.body;
  const { changeType } = req.body;
  const { type } = req.body;

  // console.log(changeType);

  // if (!session) {
  //   return res.status(500).json({ error: "You have to be logged in" });
  // }

  // get all votes from user
  try {
    if (session) {
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
            connect: { id: protocolId },
          },
        },
      });

      return res.json(newVote);
    } else {
      // Sessionless Votes
      if (changeType === "create") {
        const newVote = await prisma.protocol_Vote.create({
          data: {
            voteType: type,
            protocol: {
              connect: { id: protocolId },
            },
          },
          select: {
            id: true,
          },
        });
        // console.log("newVote: ", newVote);
        return res.json(newVote);
      }
      // Update or Delete
      else {
        // Find Sessionless Vote
        // const sessionless_vote = await prisma.protocol_Vote.findFirst({
        //   where: {
        //     userId: null,
        //     protocolId: protocolId,
        //     voteType: type,
        //   },
        //   select: {
        //     id: true,
        //   },
        // });

        // Delete Vote
        if (changeType === "delete") {
          const deletedVote = await prisma.protocol_Vote.delete({
            where: {
              id: voteId,
            },
            select: {
              id: true,
            },
          });
          // console.log(deletedVote);
          return res.json(deletedVote);
        }

        // Update Vote
        else if (changeType === "update") {
          const updatedVote = await prisma.protocol_Vote.update({
            where: {
              id: voteId,
            },
            data: {
              voteType: type,
            },
            select: {
              id: true,
            },
          });
          // console.log(updatedVote);
          return res.json(updatedVote);
        }
      }
    }
  } catch (e) {
    // console.log(e);
    return res.status(500).json({ error: e });
  }
};

export default handler;

// NOTES: Changed vote to protocol_Vote
