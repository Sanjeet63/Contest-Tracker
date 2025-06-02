import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, text }) => {
  try {
    console.log("📤 Preparing to send email to:", to);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📤 Email sent:", info.response);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
