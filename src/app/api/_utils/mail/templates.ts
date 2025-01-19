import { Event, criticalEvents } from "@/models/payment";
import moment from "moment";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME as string;

export type SendAlertsToUserEvents = (typeof criticalEvents)[number];

export function generateUserAlertEmail(type: SendAlertsToUserEvents): string {
  switch (type) {
    case "charge.succeeded":
      return generateChargeSucceededWebhookIssueEmail();
    case "charge.failed":
      return generateChargeFailedWebhookIssueEmail();
    case "customer.subscription.created":
      return generateSubscriptionCreatedWebhookIssueEmail();
    case "customer.subscription.updated":
      return generateSubscriptionUpdatedWebhookIssueEmail();
    default:
      return "";
  }
}

function generateChargeFailedWebhookIssueEmail() {
  const content = `
    <h2>Important Notice: Payment Processing Issue</h2>
    <p>Hi there,</p>
    <p>We encountered an issue while processing your recent payment for [Product/Service Name].<br/> Additionally, we faced a temporary issue with our systems while attempting to notify you about this payment status.</p>
    <p>Please note:</p>
    <ul>
      <li>If you haven't noticed any issues with our services, you can safely disregard this email.</li>
      <li>No additional action is required from you at this time.</li>
      <li>We will notify you once the issue has been resolved.</li>
    </ul>
    <p>If you have any questions or concerns, feel free to reach out to our support team for assistance.</p>
    <p>Thank you for your understanding and patience.</p>
  `;
  return baseEmailTemplate(content);
}

function generateChargeSucceededWebhookIssueEmail() {
  const content = `
    <h2>Payment Successful - Notification Delay</h2>
    <p>Hi there,</p>
    <p>Good news! Your payment for [Product/Service Name] has been successfully processed. However, we encountered a temporary issue with our systems while notifying you of this status.</p>
    <p>Please note:</p>
    <ul>
      <li>If you haven't noticed any issues with our services, you can safely disregard this email.</li>
      <li>No additional action is required from you at this time.</li>
      <li>We will notify you once the issue has been resolved.</li>
    </ul>
    <p>If you have any questions or need further assistance, feel free to contact our support team.</p>
    <p>Thank you for your understanding and trust in our services.</p>
  `;
  return baseEmailTemplate(content);
}

function generateSubscriptionCreatedWebhookIssueEmail() {
  const content = `
    <h2>Welcome to [Subscription Name] - Notification Delay</h2>
    <p>Hi there,</p>
    <p>Welcome aboard! Your subscription for [Subscription Name] has been successfully created. However, we encountered a temporary issue with our systems while notifying you about this event.</p>
    <p>Please note:</p>
    <ul>
      <li>If you haven't noticed any issues with our services, you can safely disregard this email.</li>
      <li>No additional action is required from you at this time.</li>
      <li>We will notify you once the issue has been resolved.</li>
    </ul>
    <p>If you have any questions or concerns, please don't hesitate to reach out to our support team for assistance.</p>
    <p>Thank you for your understanding and welcome to [Subscription Name]!</p>
  `;
  return baseEmailTemplate(content);
}

function generateSubscriptionUpdatedWebhookIssueEmail() {
  const content = `
    <h2>Subscription Update - Notification Issue</h2>
    <p>Hi there,</p>
    <p>We've successfully updated your subscription for [Subscription Name]. However, we encountered a temporary issue with our systems while notifying you of this change.</p>
    <p>Please note:</p>
    <ul>
      <li>If you haven't noticed any issues with our services, you can safely disregard this email.</li>
      <li>No additional action is required from you at this time.</li>
      <li>We will notify you once the issue has been resolved.</li>
    </ul>
    <p>If you have any questions or concerns, please feel free to contact our support team.</p>
    <p>Thank you for your patience and continued trust in us.</p>
  `;
  return baseEmailTemplate(content);
}

function generatePaymentProcessingIssueEmail() {
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
  event: {
    id: string;
    type: string;
  },
  eventTime: Date,
  failedWebhooks: number,
) {
  const envPath = process.env.NODE_ENV === "production" ? "" : "test/";

  const content = `
          <div class="content">
            <p><strong>Event:</strong> 
              <a 
                href="https://dashboard.stripe.com/${envPath}workbench/events/${event.id}" 
                target="_blank" 
                rel="noopener noreferrer" 
                style="color: #fa6c40; text-decoration: none;"
              >
                ${event.id}
              </a>
            </p>
            <p><strong>Occurred At:</strong> ${eventTime}</p>
            <p><strong>Failed Webhooks:</strong> ${failedWebhooks}</p>
            <p><strong>Type:</strong> ${event.type}</p>
            <p>
              The webhook for this event failed to process successfully. Please review the event details in your Stripe dashboard.
            </p>
          </div>
          <div class="button-container" style="text-align: right;">
            <a
              href="https://dashboard.stripe.com/${envPath}workbench/events/${event.id}"
              class="button"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Event in Stripe
            </a>
          </div>
    `;

  return baseEmailTemplate(content, "🚨 Webhook Failure Alert");
}

export function baseEmailTemplate(content: string, header?: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${APP_NAME} Notification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #090909; /* hsl(0, 0%, 3.9%) */
          background-color: #fafafa; /* hsl(0, 0%, 98%) */
          margin: 0;
          padding: 0;
        }
        h2 {
          color: #222222; /* hsl(0, 0%, 13.3%) */
          font-size: 24px;
          margin-top: 0;
          font-weight: 600;
        }
        p {
          margin: 10px 0;
        }
        .mail-container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff; /* hsl(0, 0%, 100%) */
          border: 1px solid #e4e4e4; /* hsl(0, 0%, 89.8%) */
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #fa6c40; /* hsl(13.8, 72.9%, 56.7%) */
          color: #ffffff; /* hsl(338.2, 0%, 100%) */
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
          background-color: #fa6c40; /* hsl(13.8, 72.9%, 56.7%) */
          color: #ffffff !important; /* hsl(338.2, 0%, 100%) */
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 0.25rem;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #737373; /* hsl(0, 0%, 45.1%) */
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="mail-container">
        <div class="header">
          <h1>${header || "${APP_NAME}"}</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>This is an automated message from ${APP_NAME}. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function successfulTokensPurchaseEmail(tokens: number, price: number) {
  const pricePerToken = (price / tokens).toFixed(4);
  const content = `
    <h2>Thank you for your purchase!</h2>
    <p>Hi there,</p>
    <p>We wanted to let you know that your purchase was successful. You've successfully acquired ${tokens} tokens for your account.</p>
    <p>Here's a summary of your purchase:</p>
    <ul>
      <li><strong>Tokens:</strong> ${tokens}</li>
      <li><strong>Price:</strong> $${price}</li>
      <li><strong>Price per Token:</strong> $${pricePerToken}</li>
    </ul>
    <p>If you have any questions or need further assistance, feel free to reach out to me at: orelsmail@gmail.com.</p>
    <p>Thank you for your purchase and continued trust in our services.</p>
  `;
  return baseEmailTemplate(content);
}

export function newSubscriptionAdminNotificationEmail(data: {
  userEmail: string;
  userName: string;
  planName: string;
  planPrice: number;
  interval: string;
  subscriptionId: string;
  startDate: Date;
}) {
  const content = `
    <h2>🎉 New Subscription Alert!</h2>
    <p>A new user has subscribed to ${APP_NAME}!</p>
    
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
      <h3 style="margin-top: 0;">User Details</h3>
      <p><strong>Name:</strong> ${data.userName}</p>
      <p><strong>Email:</strong> ${data.userEmail}</p>
    </div>

    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
      <h3 style="margin-top: 0;">Subscription Details</h3>
      <p><strong>Plan:</strong> ${data.planName}</p>
      <p><strong>Price:</strong> $${data.planPrice}/${data.interval}</p>
      <p><strong>Start Date:</strong> ${moment(data.startDate).format('MMMM D, YYYY HH:mm:ss')}</p>
      <p><strong>Subscription ID:</strong> ${data.subscriptionId}</p>
    </div>

    <div class="button-container" style="text-align: right;">
      <a
        href="https://dashboard.stripe.com/${process.env.NODE_ENV === 'production' ? '' : 'test/'}subscriptions/${data.subscriptionId}"
        class="button"
        target="_blank"
        rel="noopener noreferrer"
      >
        View in Stripe Dashboard
      </a>
    </div>
  `;

  return baseEmailTemplate(content, "New Subscription Notification");
}
