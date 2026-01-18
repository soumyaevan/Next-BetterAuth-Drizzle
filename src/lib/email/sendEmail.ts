import nodemailer from "nodemailer";
import postmark from "postmark";
export const sendEmail = async ({
  to,
  subject,
  text,
  link,
}: {
  to: string;
  subject: string;
  text: string;
  link: string;
}) => {
  try {
    // const info = await transporter.sendMail({
    //   from: '"Soumya Sen" <reanna.beer60@ethereal.emaill>',
    //   to: to,
    //   subject: subject,
    //   html: `<p>${text}</p><br/><a href=${link}>Verification Link</a>`,
    // });
    // console.log("Email sent:", info.messageId);
    // return { success: true, info };
    // Require:
    // Send an email:
    const client = new postmark.ServerClient(
      process.env.POSTMARK_CLIENT as string
    );

    client.sendEmail({
      From: process.env.POSTMARK_EMAIL as string,
      To: (process.env.POSTMARK_EMAIL as string) || to,
      Subject: subject,
      HtmlBody: `<p>${text}</p><br/><a href=${link}>Verification Link</a>`,
      TextBody: "Hello from Your Blog!",
      MessageStream: "outbound",
    });
  } catch (error) {
    console.error("Email error:", error);
    return { success: false };
  }
};
