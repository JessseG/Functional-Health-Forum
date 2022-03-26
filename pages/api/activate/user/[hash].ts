import { useRouter } from "next/router";
import prisma from "../../../../db";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";

const activateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const hash = req.query.hash;
  //   const router = useRouter();

  if (!hash) {
    return res.status(401).json({ message: "Cannot Validate User 1" });
  }

  //   console.log(new Date().toISOString());

  try {
    const pUser = await prisma.pUser.findUnique({
      where: { id: String(hash) },
    });

    if (pUser) {
      const verifiedUser = await prisma.user.create({
        data: {
          name: pUser.name,
          email: pUser.email,
          dobDay: pUser.dobDay,
          dobMonth: pUser.dobMonth,
          dobYear: pUser.dobYear,
          password: pUser.password,
          emailVerified: new Date().toISOString(),
        },
      });

      if (verifiedUser) {
        const deletePendingUser = await prisma.pUser.delete({
          where: { id: String(pUser.id) },
        });

        res.redirect("/login");
      } else {
        res.redirect("/_error");
      }
    } else {
      res.redirect("/_error");
    }
  } catch (e) {
    return res.status(401).json({ message: "Cannot Validate User 3" });
    // console.log(e);
  }

  //   return res.status(401).json({ message: "Cannot Validate User" });
};

export default activateUser;
