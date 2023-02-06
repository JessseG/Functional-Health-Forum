import prisma from "../../../db";
import { getSession } from "next-auth/react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const handler = async (req, res) => {
  const { reply } = req.body;
  const session = await getSession({ req });

  // if (!session) {
  //   return res.status(500).json({ error: "You have to be logged in" });
  // }
  // console.log(reply.community);
  try {
    if (session) {
      const newReply = await prisma.post_Comment.create({
        data: {
          body: reply.body,
          // post: reply.post,
          post: { connect: { id: reply.post.id } },
          community: {
            connect: {
              name: reply.community,
            },
          },
          user: {
            connect: {
              id: String(session.userId),
            },
          },
          votes: {
            create: {
              post: { connect: { id: reply.post.id } },
              user: { connect: { id: String(session.userId) } },
              voteType: "UPVOTE",
            },
          },
        },
      });

      return res.json(newReply);
    } else {
      // Sessionless reply
      const newReply = await prisma.post_Comment.create({
        data: {
          body: reply.body,
          post: { connect: { id: reply.post.id } },
          community: {
            connect: {
              name: reply.community,
            },
          },
          votes: {
            create: {
              post: { connect: { id: reply.post.id } },
              voteType: "UPVOTE",
            },
          },
        },
        select: {
          body: true,
          accessCode: true,
          community: {
            select: {
              name: true,
            },
          },
        },
      });

      const backgroundColor = "#f4f4f4";
      const textColor = "#444444";
      const mainBackgroundColor = "#ffffff";
      const buttonBackgroundColor = "#346df1";
      const buttonBorderColor = "#346df1";
      const buttonTextColor = "#ffffff";
      const linkBorderColor = "#737373";

      //  <div style="margin: 13.5px 15px 0px 18px; font-size: 15.6px; font-weight: 600; color: #595959;">
      //    ${newReply.title}
      //  </div>

      const email_subject = "Here's your Healwell Access Code";
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
                  <div style="margin: 5.6px 15px 14px 18px; font-size: 13px; font-weight: 500; color: ${textColor};">
                    ${newReply.body}
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 8px 0px 0px 0px; font-size: 14.7px; font-family: Helvetica, Arial, sans-serif; color: #454545;">
                Use this code to Edit or Delete your Reply Anytime!
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 6px 0px 3.5px 0px;">
                <table border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" style="border-radius: 5px;" bgcolor="${backgroundColor}">
                      <div style="font-size: 14.5px; font-family: Helvetica, Arial, sans-serif; color: black; text-decoration: none; border-radius: 5px; 
                        padding: 7px 20px; border: 1px solid ${linkBorderColor}; display: inline-block; font-weight: 500; cursor: text;">${newReply.accessCode}
                      </div>
                    </td>
                    <td align="center">
                      <div style="margin-left:17px; border-radius: 5px; background-color:${buttonBackgroundColor};">
                        <a href="${process.env.NEXTAUTH_URL}/communities/${newReply.community.name}" target="_blank" style="font-size: 14.5px; font-family: Helvetica, Arial, 
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
          email: reply.accessEmail,
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
              return { status: response.status, newPost: newReply };
            }
            // console.log("axios res data: ");
          })
          .catch(function (error) {
            // console.log("axios error: ", error);
            return res.json({ status: "Email failure" });
          });
        return res.json(resp);
      } else {
        return res.json({ status: "Email failure", newPost: newReply });
      }
    }
  } catch (e) {
    // console.log(e);
    return res.status(500).json({ error: e });
  }
};

export default handler;
