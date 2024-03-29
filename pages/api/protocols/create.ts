import prisma from "../../../db";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
// import { Prisma } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { protocol } = req.body;
  const session = await getSession({ req });

  // if (!session) {
  //   return res.status(500).json({ error: "You have to be logged in" });
  // }

  // const selectValues: Prisma.ProtocolSelect = {
  //   accessCode: true,
  //   community: {
  //     select: {
  //       name: true,
  //     },
  //   },
  // };

  // console.log(protocol);

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
          votes: {
            create: {
              voteType: "UPVOTE",
            },
          },
        },
        select: {
          title: true,
          body: true,
          products: true,
          accessCode: true,
          community: {
            select: {
              name: true,
            },
          },
        },
      });

      // console.log(newProtocol.products);

      const backgroundColor = "#f4f4f4";
      const textColor = "#444444";
      const mainBackgroundColor = "#ffffff";
      const buttonBackgroundColor = "#346df1";
      const buttonBorderColor = "#346df1";
      const buttonTextColor = "#ffffff";
      const linkBorderColor = "#737373";

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
                <td align="center" style="padding: 10px 0px 0px 0px; font-size: 19px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                  <strong>Thank you for Posting on Healwell!</strong>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 17px 0px 17px; font-size: 13px; font-family: Helvetica, Arial, sans-serif; ">
                  <div style="border: 1.4px solid #747474; border-radius: 3px; ">
                    <div style="margin: 13.5px 15px 0px 18px; font-size: 15.6px; font-weight: 600; color: #595959;">
                      ${newProtocol.title}
                    </div>
                    <div style="margin: 6.7px 0px 5.5px 21px; font-size: 13px; font-weight: 500; color: ${textColor};">
                      <ul style="margin: 0; padding: 0; list-style-type: square;">
                        ${newProtocol.products
                          .map((product) => {
                            return `<li><span style="color: rgb(16,185,129); font-weight: 600;">${product.name}</span>  -  <span style="color: black; ">${product.dose}</span>  -  <span>${product.procedure}</span></li>`;
                          })
                          .join("")}
                      </ul>
                    </div>
                    <div style="margin: 7.5px 15px 14px 18px; font-size: 13px; font-weight: 500; color: ${textColor};">
                      ${newProtocol.body}
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 8px 0px 0px 0px; font-size: 14.7px; font-family: Helvetica, Arial, sans-serif; color: #454545;">
                  Use this code to Edit or Delete your Post & Protocol Anytime!
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 6px 0px 3.5px 0px;">
                  <table border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center" style="border-radius: 5px;" bgcolor="${backgroundColor}">
                        <div style="font-size: 14.5px; font-family: Helvetica, Arial, sans-serif; color: black; text-decoration: none; border-radius: 5px; 
                          padding: 7px 20px; border: 1px solid ${linkBorderColor}; display: inline-block; font-weight: 500; cursor: text;">${
        newProtocol.accessCode
      }
                        </div>
                      </td>
                      <td align="center">
                        <div style="margin-left:17px; border-radius: 5px; background-color:${buttonBackgroundColor};">
                          <a href="${process.env.NEXTAUTH_URL}/communities/${
        newProtocol.community.name
      }" target="_blank" style="font-size: 14.5px; font-family: Helvetica, Arial, 
                            sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 7px 20px; border: 1px solid ${buttonBorderColor}; 
                            display: inline-block; font-weight: 600; cursor: text;">Take me
                          </a>
                        </div>
                      </td>
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
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="padding: 3px 0px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
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
        const resp = await axios(sendEmail)
          .then(async function (response) {
            // console.log("axios res: ", response);
            // console.log("Axios Response data: ", response.data);
            if (response.data) {
              // console.log("response status: ", response.status);
              // console.log("response statusText: ", response.statusText);
              return {
                status: response.status,
                newProtocol: newProtocol,
              };
            }
            // console.log("axios res data: ");
          })
          .catch(function (error) {
            // console.log("axios error: ", error);
            return res.json({ status: "Email failure" });
          });
        return res.json(resp);
      } else {
        return res.json({ status: "Email failure", newProtocol: newProtocol });
      }
    }
  } catch (e) {
    // console.log(e);
    return res.status(500).json({ error: e });
  }
};

export default handler;
