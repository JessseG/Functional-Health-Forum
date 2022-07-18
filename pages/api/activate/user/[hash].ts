import { useRouter } from "next/router";
import prisma from "../../../../db";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";

const activateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const hashID = req.query.hash;
  //   const router = useRouter();

  if (!hashID) {
    return res.status(401).json({ message: "Cannot Validate User 1" });
  }

  // console.log(new Date().toISOString());

  try {
    const pUser = await prisma.pUser.findUnique({
      where: { id: String(hashID) },
    });

    if (pUser) {
      const verifiedUser = await prisma.$transaction([
        prisma.user.create({
          data: {
            name: pUser.name,
            email: pUser.email,
            dobDay: pUser.dobDay,
            dobMonth: pUser.dobMonth,
            dobYear: pUser.dobYear,
            password: pUser.password,
            emailVerified: new Date().toISOString(),
          },
        }),
        prisma.pUser.delete({
          where: { id: String(pUser.id) },
        }),
      ]);
      if (verifiedUser) {
        // res.status(200).json({ message: "User Validated!" });
        res.redirect("/login");
      } else {
        // console.log("e-1");
        res.redirect("/_error");
      }
    } else {
      // res.status(401).json({ message: "Cannot Validate Pending User: does not exist" });
      // console.log("e-2");
      res.redirect("/_error");
    }
  } catch (e) {
    // return res.status(401).json({ message: "Cannot Validate User" });
    // console.log(e);
    // console.log("e-3");
    res.redirect("/_error");
  }
};

export default activateUser;
