import prisma from "../../../db";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { protocol } = req.body;
  const session = await getSession({ req });

  // if (!session) {
  //   return res.status(500).json({ error: "You have to be logged in" });
  // }

  try {
    if (session) {
      const newProtocol = await prisma.protocol.create({
        data: {
          title: protocol.title,
          body: protocol.body,
          products: {
            create: protocol.products,
          },
          community: {
            connect: {
              name: protocol.community,
            },
          },
          user: {
            connect: {
              id: String(session.userId),
            },
          },
          votes: {
            create: {
              user: { connect: { id: String(session.userId) } },
              voteType: "UPVOTE",
            },
          },
        },
      });
      return res.json(newProtocol);
    }
    // Create Protocol Without Session/Account
    else {
      const newProtocol = await prisma.protocol.create({
        data: {
          title: protocol.title,
          body: protocol.body,
          products: {
            create: protocol.products,
          },
          community: {
            connect: {
              name: protocol.community,
            },
          },
          user: null,
          votes: {
            create: {
              user: null,
              voteType: "UPVOTE",
            },
          },
        },
        select: {
          accessCode: true,
          community: {
            select: {
              name: true,
            },
          },
        },
      });

      // console.log(newProtocol);

      const backgroundColor = "#f4f4f4";
      const textColor = "#444444";
      const mainBackgroundColor = "#ffffff";
      const buttonBackgroundColor = "#346df1";
      const buttonBorderColor = "#346df1";
      const buttonTextColor = "#ffffff";

      const email_subject = "Here's your Healwell Post/Protocol Access Code";

      const html_message = `
          <body style="background: ${backgroundColor};">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                </td>
              </tr>
            </table>
            <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
              <tr>
                <td align="center" style="padding: 10px 0px 0px 0px; font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                  <strong>Thank you for Posting on Healwell!</strong>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 8px 0px 0px 0px; font-size: 13px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                  Use this code to Edit or Delete your Posts & Protocols Anytime!
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 13px 0;">
                  <table border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${process.env.NEXTAUTH_URL}/communities/${newProtocol.community.name}" target="_blank" style="font-size: 13px; 
                      font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 7px 20px; border: 1px solid ${buttonBorderColor}; 
                      display: inline-block; font-weight: bold;">${newProtocol.accessCode}</a></td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 0px 0px 5px 0px; text-decoration: underline; font-size: 12px; line-height: 17px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                  If you did not request this email you can safely ignore it.
                </td>
              </tr>
            </table>
          </body>`;

      const sendEmail: AxiosRequestConfig = {
        method: "post",
        url: `${process.env.NEXTAUTH_URL}/api/auth/mailer`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          email: protocol.accessEmail,
          email_subject: email_subject,
          html_message: html_message,
        },
      };

      if (sendEmail) {
        const res = await axios(sendEmail)
          .then(async function (response) {
            // console.log("axios res: ", response);
            // console.log("Axios Response data: ", response.data);
            if (response.data) {
              // console.log("response status: ", response.status);
              // console.log("response statusText: ", response.statusText);
              return res.json({ status: "success", newProtocol: newProtocol });
            }
            // console.log("axios res data: ");
          })
          .catch(function (error) {
            // console.log("axios error: ", error);
            return res.json({ status: "failure" });
          });
      }
    }
  } catch (e) {
    // console.log(e);
    return res.status(500).json({ error: e });
  }
};

export default handler;
