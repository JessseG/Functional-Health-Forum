import nodemailer from "nodemailer";

exports.sendConfirmationEmail = function ({ toUser, hash }) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_PASSWORD,
      },
    });

    const message = {
      from: process.env.GOOGLE_USER,
      to: process.env.GOOGLE_USER,
      //   to: toUser.email   // Production
      subject: "Health Forum - Account Activation",
      html: `
      <h3>Hello ${toUser.username}</h3>
      <p>Thank you for registering with us.</p>
      <p>Click on the link below to activate your account!</p>
      <p><a target="_" href="${process.env.NEXTAUTH_URL}/api/activate/user/${hash}">Activation Link</a></p>`,
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};
