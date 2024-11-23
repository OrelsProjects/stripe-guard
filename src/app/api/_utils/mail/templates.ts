export const welcomeTemplate = (paid: boolean, to: string) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Your Vote of Confidence</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #333333;
            line-height: 1.6;
            padding: 0;
            margin: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            color: #333333;
        }
        .button-container {
            text-align: center;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            color: #ffffff;
            background-color: #4Cea70;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
            font-weight: bold;
        }
        .footer {
            font-size: 12px;
            color: #777777;
            text-align: center;
            margin-top: 20px;
            padding-top: 10px;
        }
        .divider {
            margin-top: 30px;
            border-top: 1px solid #dddddd;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">Thank you for your vote of confidence</h1>
        
        ${
          paid
            ? `<p><strong>Payment Confirmation:</strong> Thank you for your payment! Your support means a lot, and I’m excited to have you here!</p>`
            : ""
        }

        <p>Hey, this is Orel, and I want to “officially” welcome you to my world.</p>
        
        <p>About 7 years ago I built my first ever website while I was in the army (A basic todo). And from a thing that I must do, it became my obsession.</p>
        
        <p>During this time I developed almost everything, from a website with basic HTML, CSS through a fullstack website to a Unity game and about a dozen more things in between.</p>
        
        <p>I am not going to talk about those here… those are my playground where I test new ways of thinking and find great opportunities.</p>
        
        <p>And after so many projects, I found that one of the best places to find success is SaaS businesses. They require almost 0$ and can generate TONS of value.</p>
        
        <p>My goal with this product is to help you transfer the ideas from your head to a functional website with a beautiful landing page to test your ideas.</p>
        
        <p>${
          paid
            ? `<strong>In fact, by paying up front and giving me your FULL confidence, you grabbed a spot in the TOP-SECRET list. It’s a very small group of people that will get many FREE stuff and EXTREMELY good deals in the future.</strong>`
            : `In fact, you signing up boosts my moral and will make the product come out that much faster!`
        }</p>
        
        <p>In the following weeks I’ll keep you updated about the progress and send you your landing page ASAP.</p>
        
        <p>Talk to you soon,</p>
        <p>Orel</p>

        <p><strong>P.S.</strong></p>
        ${
          paid
            ? `Your feedback or features requests are very important to me!<br/> Please do hit reply and let me know about them.`
            : `
        <p>Seems like you didn’t go for the full GitHub repository plan, and only for the landing page.<br/> I’d highly recommend you go and grab it fast (spots are limited) so you can ship in minutes and get awesome bonuses!</p>
        
        <div class="button-container">
            <a href="https://www.buildquick.app/?repository=true&to=${encodeURIComponent(
              to
            )}" class="button">Get Full Repository NOW</a>
        </div>
        `
        }
        
        <div class="divider"></div>

        <footer class="footer">
            <p>Created with ❤️ by Orel</p>
            <p>If you didn’t enjoy this email, feel free to reply and let me know why.</p>
            <p>In case you really hate emails from me, you can always <a href="%unsubscribe_url%" style="color: #4CAF50; text-decoration: none;">unsubscribe here</a>.</p>
        </footer>
    </div>
</body>
</html>
`;
