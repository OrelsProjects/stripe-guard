// Send mail with mailgun
import Mailgun from "mailgun.js";
import formData from "form-data";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "",
});

export const sendWelcomeMail = async (to: string, name: string) => {
  const data = {
    from: "Excited User <mailgun@sandbox4b056e676ebe44e9b3c255d7b94b8039.mailgun.org>",
    to: [to],
    subject: "Hello",
    text: "Testing some Mailgun awesomeness!",
    html: "<h1>Testing some Mailgun awesomeness!</h1>",
  };

  await mg.messages.create(
    "sandbox4b056e676ebe44e9b3c255d7b94b8039.mailgun.org",
    data,
  );
};
