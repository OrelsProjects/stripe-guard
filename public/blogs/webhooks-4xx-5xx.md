---
slug: "webhooks-4xx-5xx"
title: "Webhooks: What to Do When the HTTP Status Code Starts with a Four (4xx) or Five (5xx)"
excerpt: "Understand how 4xx and 5xx HTTP status codes impact Stripe webhooks and explore practical solutions to fix them."
publishedAt: "2025-01-02T12:00:00Z"
readingTime: "5 min read"
author:
  name: "Orel Zilberman"
  role: "Founder of StripeProtect"
  avatar: "/founder-image.jpg"
---

[**Original Stripe Documentation Reference**](https://support.stripe.com/questions/webhooks-what-to-do-when-the-http-status-code-starts-with-a-four-(4xx)-or-five-(5xx))

## Introduction
When Stripe sends a webhook event, it expects a 2xx response. Status codes in the 400–499 or 500–599 range indicate your server received the request but couldn’t process it correctly. Let’s see why these errors happen and how you can address them.

---

## Common 4xx/5xx Errors

### 1. **No Signatures Found Matching the Expected Signature for Payload**
This error typically means the webhook signature verification process failed:
- **Wrong Webhook Secret**: Ensure you’re using the correct `whsec_` value associated with your specific Stripe endpoint.  
- **Modified Request Body**: The raw body from Stripe must remain unaltered before signature verification.

### 2. **Timestamp Outside the Tolerance Zone**
Stripe uses time-based signatures:
- Verify your server’s clock is accurate.
- Process webhooks as soon as they arrive, without delays.

### 3. **Internal Server Error**
Often caused by:
- Exceptions in your code.
- Parsing errors or incompatible API versions.
- Infrastructure changes (server migrations, new dependencies, etc.).

### 4. **Other 4xx/5xx Causes**
- **Rate Limiting**: Overloading your endpoint can lead to 429 (though that’s a 4xx variant).  
- **Configuration Errors**: Mismatched API versions or misrouted endpoint URLs.  

---

## How to Troubleshoot

1. **Check the Stripe Dashboard** for server responses or error messages.  
2. **Inspect Server Logs**: Pinpoint the exact error or exception.  
3. **Confirm API Version Compatibility**: Mismatched versions can cause webhook payload discrepancies.  
4. **Verify Signature**: Make sure you fetch the raw request body (especially crucial in Next.js or Node.js).  
5. **Use Background Jobs**: For heavy-lift operations, keep the webhook response lean.  

---

## Quick Tips
- **Ensure Proper Exception Handling**: Gracefully handle errors so you don’t default to a 5xx response.  
- **Log Every Failure**: Detailed logs are your friend when diagnosing 4xx or 5xx errors.  
- **Test With Stripe CLI**: Emulate different webhook scenarios in your local or test environment.

---

## Additional Resources

- **[Mitigating Stripe Webhook Failures: Best Practices and Tools](/blog/mitigating-stripe-webhook-failures)**: Our in-depth guide on preventing common webhook issues.  
- **[Webhooks: What to Do When the HTTP Status Code Starts with a Three (3xx)](/blog/webhooks-3xx)**: Learn how 3xx status codes can affect your webhook deliverability.  

---