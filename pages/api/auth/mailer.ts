import nodemailer from "nodemailer";
// import { send } from "process";

export default async (req, res) => {
  const { email, name } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: 587,
    secure: true,
    auth: {
      user: process.env.GOOGLE_USER,
      pass: process.env.GOOGLE_PASSWORD,
    },
  });

  // Some simple styling options
  const backgroundColor = "#f9f9f9";
  const textColor = "#444444";
  const mainBackgroundColor = "#ffffff";
  const buttonBackgroundColor = "#346df1";
  const buttonBorderColor = "#346df1";
  const buttonTextColor = "#ffffff";

  const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`;
  // const escapedHost = `${host.replace(/\./g, "&#8203;.")}`;

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
            Your account email: <strong>${escapedEmail}</strong>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${process.env.NEXTAUTH_URL}" target="_blank" style="font-size: 15px; 
                font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; 
                display: inline-block; font-weight: bold;">Activate Account</a></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
            If you did not request this email you can safely ignore it.
          </td>
        </tr>
      </table>
    </body>`;

  try {
    const emailRes = await transporter.sendMail({
      from: process.env.GOOGLE_USER,
      to: email,
      subject: "Activation Email",
      html: html_message,
    });
    console.log("Message Sent: ", emailRes.messageId);
  } catch (e) {
    console.log(e);
  }
  res.status(200).json(req.body);
};

//__________________________________________________

// const sendVerificationRequest = async ({
//   pUser,
//   hash,
//   identifier: email,
//   url,
//   provider: { server, from },
// }) => {
//   const { host } = new URL(url);
//   console.log("host: ", host);
//   console.log("server: ", server);
//   console.log("from: ", from);
//   const transport = nodemailer.createTransport({
//     service: "gmail",
//     secure: true,
//     auth: {
//       user: process.env.GOOGLE_USER,
//       pass: process.env.GOOGLE_PASSWORD,
//     },
//   });

//   const tried = await transport
//     .sendMail({
//       // to: pUser.email,
//       to: process.env.GOOGLE_USER,
//       from: process.env.GOOGLE_USER,
//       subject: `Sign in to ${host}`,
//       text: text({ url, host }),
//       html: html({ url, host, email }),
//     })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//     });
//   console.log(tried);
// };
// // console.log("here");

// // Email HTML body
// function html({ url, host, email }: Record<"url" | "host" | "email", string>) {
//   // Insert invisible space into domains and email address to prevent both the
//   // email address and the domain from being turned into a hyperlink by email
//   // clients like Outlook and Apple mail, as this is confusing because it seems
//   // like they are supposed to click on their email address to sign in.
//   const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`;
//   const escapedHost = `${host.replace(/\./g, "&#8203;.")}`;

//   // Some simple styling options
//   const backgroundColor = "#f9f9f9";
//   const textColor = "#444444";
//   const mainBackgroundColor = "#ffffff";
//   const buttonBackgroundColor = "#346df1";
//   const buttonBorderColor = "#346df1";
//   const buttonTextColor = "#ffffff";

//   return `
//     <body style="background: ${backgroundColor};">
//       <table width="100%" border="0" cellspacing="0" cellpadding="0">
//         <tr>
//           <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
//             <strong>${escapedHost}</strong>
//           </td>
//         </tr>
//       </table>
//       <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
//         <tr>
//           <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
//             Sign in as <strong>${escapedEmail}</strong>
//           </td>
//         </tr>
//         <tr>
//           <td align="center" style="padding: 20px 0;">
//             <table border="0" cellspacing="0" cellpadding="0">
//               <tr>
//                 <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Sign in</a></td>
//               </tr>
//             </table>
//           </td>
//         </tr>
//         <tr>
//           <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
//             If you did not request this email you can safely ignore it.
//           </td>
//         </tr>
//       </table>
//     </body>`;
// }

// // Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
// function text({ url, host }: Record<"url" | "host", string>) {
//   return `Sign in to ${host}\n${url}\n\n`;
// }

// export default sendVerificationRequest;
