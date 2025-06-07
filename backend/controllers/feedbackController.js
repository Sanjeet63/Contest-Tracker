import nodemailer from "nodemailer";

export const sendFeedback = async (req, res) => {
  const { email, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Missing email credentials");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Feedback Received",
      text: `From: ${email}\n\n${message}`,
    });

    res.status(200).json({ message: "Feedback sent successfully!" });
  } catch (err) {
    console.error("Error sending feedback:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
