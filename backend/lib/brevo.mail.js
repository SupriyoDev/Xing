import { transporter } from "./brevo.js";
import { createWelcomeEmailTemplate } from "./mailTemplate.js";

//welcome email function

export async function sendWelcomeEmail(name, email, profileUrl) {
  try {
    await transporter.sendMail({
      from: "supriyamaji.math@gmail.com",
      to: email,
      subject: "Welcome to my Platform!",
      html: createWelcomeEmailTemplate(name, profileUrl),
      text: `Welcome, ${name}!
        
        Thank you for signing up for our platform. 
        We're excited to have you on board!
        
        Get started by:
        - Completing your profile
        - Connecting with colleagues
        - Exploring our features
        
        If you have any questions, contact our support team.
        
        Best regards,
        Your Company Team`,
    });

    console.log("Welcome email sent successfully");
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
}
