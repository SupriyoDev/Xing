import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

//brevo smtp configuration
export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: "587",
  secure: false, // Use TLS
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASSWORD,
  },
  from: "supriyamaji.math@gmail.com",
});
