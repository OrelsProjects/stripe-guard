import { Event } from "@/models/payment";

export function generatePaymentProcessingIssueEmail() {
  const content = `
    <h2>Important Notice: Payment Processing Issue</h2>
    <p>Hey there!</p>
    <p>We hope this email finds you well.<br/> We wanted to inform you that we've encountered an issue while processing your recent payment.</p>
    <p>Our team is actively working on resolving this matter, and we apologize for any inconvenience this may cause. During this time, you may notice that some of our services are temporarily unavailable.</p>
    <p>Please note:</p>
    <ul>
      <li>If you haven't noticed any issues with our services, you can safely disregard this email.</li>
      <li>No additional action is required from you at this time.</li>
      <li>We will notify you once the issue has been resolved.</li>
    </ul>
    <p>We appreciate your patience and understanding as we work to rectify this situation. If you have any questions or concerns, please don't hesitate to reach out to our customer support team.</p>
    <p>Thank you for your continued trust in our services.</p>
    `;
  // <a href="https://your-support-url.com" class="button">Contact Support</a>
  return baseEmailTemplate(content);
}

export function generateWebhookFailureEmail(
  event: Event,
  eventTime: Date,
  failedWebhooks: number,
) {
  const envPath = process.env.NODE_ENV === "production" ? "" : "test/";

  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Webhook Failure Notification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding: 20px 0;
          }
          .header h1 {
            margin: 0;
            color: #4a00e0;
            font-size: 24px;
          }
          .content {
            padding: 20px;
          }
          .content p {
            margin: 10px 0;
          }
          .button-container {
            text-align: center;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            text-decoration: none;
            background-color: #635bff;
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.6);
          }
          .button:hover {
            background-color: #5144d3;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 Webhook Failure Alert</h1>
          </div>
          <div class="content">
            <p><strong>Event:</strong> ${event.id}</p>
            <p><strong>Occurred At:</strong> ${eventTime}</p>
            <p><strong>Failed Webhooks:</strong> ${failedWebhooks}</p>
            <p><strong>Type:</strong> ${event.type}</p>
            <p>
              The webhook for this event failed to process successfully. Please review the event details in your Stripe dashboard.
            </p>
          </div>
          <div class="button-container">
            <a
              href="https://dashboard.stripe.com/${envPath}workbench/events/${event.id}"
              class="button"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Event in Stripe
            </a>
          </div>
          <div class="footer">
            <p>This is an automated notification from your Stripe webhook handler.</p>
          </div>
        </div>
      </body>
      </html>
    `;
}

export function baseEmailTemplate(content: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>StripeProtect Notification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: hsl(0, 0%, 3.9%);
          background-color: hsl(0, 0%, 98%);
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: hsl(0, 0%, 100%);
          border: 1px solid hsl(0, 0%, 89.8%);
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: hsl(221.2, 83.2%, 53.3%);
          color: hsl(210, 40%, 98%);
          padding: 20px;
          text-align: center;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
        .content {
          padding: 20px;
        }
        .button {
          display: inline-block;
          background-color: hsl(221.2, 83.2%, 53.3%);
          color: hsl(210, 40%, 98%);
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 0.25rem;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: hsl(0, 0%, 45.1%);
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>StripeProtect</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>This is an automated message from StripeProtect. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
