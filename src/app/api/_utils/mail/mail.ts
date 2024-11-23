import { welcomeTemplate } from "@/app/api/_utils/mail/templates";
import axios from "axios";

export const sendWelcomeMail = async (
  to: string,
  paid: boolean = false
) => {
  const data = {
    from: "Build Quick <postmaster@mail.saas-template.app>",
    to: to,
    subject: "Welcome to Build Quick!" + (paid ? " (Payment confirmed)" : ""),
    html: welcomeTemplate(paid, to),
  };

  try {
    const response = await axios.post(
      `https://api.mailgun.net/v3/${process.env.MAILGUN_ORG}/messages`,
      new URLSearchParams({
        from: data.from,
        to: data.to,
        subject: data.subject,
        html: data.html,
      }),
      {
        auth: {
          username: "api",
          password: process.env.MAILGUN_API_KEY || "",
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Mail sent successfully:", response.data);
  } catch (error: any) {
    throw new Error(`Error sending mail: ${error.message}`);
  }
};
