import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "alphonso29@ethereal.email",
    pass: "RWDws4QzAnD8HZfZ2U",
  },
});

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
    const info = await transporter.sendMail({
      from: '"Soumya Sen" <reanna.beer60@ethereal.emaill>',
      to: to,
      subject: subject,
      html: `<p>${text}</p><br/><a href=${link}>Verification Link</a>`,
    });
    console.log("Email sent:", info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false };
  }
};
