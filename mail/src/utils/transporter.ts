import { createTransport } from "nodemailer";
import "dotenv/config";

type EmailOptions = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export const transporter = createTransport({
  service: "SMTP",
  host: process.env.EMAIL_HOST || "",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const mailOptions = {
      from: `Medical agenda  <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.info("Email envoyé avec succès:", result.messageId);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
};
