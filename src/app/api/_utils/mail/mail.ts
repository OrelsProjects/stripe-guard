import axios from "axios";

export const sendMail = async (
  to: string,
  from: string,
  subject: string,
  template: string,
) => {
  const data = {
    from: from + " " + "<alert@mail.stripe-guard.com>",
    to: to,
    subject,
    html: template,
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
      },
    );

    console.log("Mail sent successfully:", response.data);
  } catch (error: any) {
    throw new Error(`Error sending mail: ${error.message}`);
  }
};
