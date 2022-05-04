import prisma from "../../../db";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  const { protocolId } = req.body;
  const session = await getSession({ req });

  const id = Number(protocolId);

  if (!session) {
    return res.status(500).json({ error: "You have to be logged in" });
  }

  try {
    const deleteProtocol = await prisma.protocol.delete({
      where: { id },
    });

    if (!deleteProtocol) {
      return res.status(500).json({ error: "Post no longer exits" });
    }
    return res.json(deleteProtocol);
  } catch (e) {
    // console.log(e);
    return res.status(500).json({ error: e });
  }
};

export default handler;
