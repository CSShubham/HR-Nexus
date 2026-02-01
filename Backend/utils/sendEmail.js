// import nodemailer from "nodemailer";

// const sendEmail = async ({ to, subject, html }) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: `"HR Nexus" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     html,
//   });
// };

// export default sendEmail;
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  return await resend.emails.send({
    from: "HR Nexus <onboarding@resend.dev>", // works instantly
    to,
    subject,
    html,
  });
};

export default sendEmail;
