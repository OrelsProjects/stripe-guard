---
slug: "webhooks-3xx"
title: "Webhooks: What to Do When the HTTP Status Code Starts with a Three (3xx)"
excerpt: "Explore why Stripe sees 3xx redirects as delivery failures and how to eliminate unnecessary redirects in your webhook workflows."
publishedAt: "2025-01-02T12:00:00Z"
readingTime: "4 min read"
author:
  name: "Orel Zilberman"
  role: "Starter"
  avatar: "/founder-image.jpg"
---

[**Original Stripe Documentation Reference**](https://support.stripe.com/questions/webhooks-what-to-do-when-the-http-status-code-starts-with-a-three-(3xx))

## Introduction
When Stripe sends webhooks to your endpoint, any 3xx status code indicates a redirection. Stripe treats all redirects as failures because they introduce extra hops that can break secure, consistent delivery.

---

## Common Reasons for 3xx

1. **Forced WWW or Non-WWW Redirect**  
   - If your server is configured to redirect `example.com` to `www.example.com` (or vice versa), Stripe sees this as a failed attempt.
2. **Trailing Slash Redirect**  
   - `https://example.com/webhooks` vs. `https://example.com/webhooks/` can cause automatic redirects, resulting in a 3xx status.
3. **Legacy or Moved Endpoints**  
   - Old endpoints that now point to new routes or domains via HTTP redirect.

---

## How to Resolve 3xx for Stripe Webhooks

1. **Use the Final URL**  
   - If your final endpoint is `https://www.example.com/webhooks/`, put that exact URL in the Stripe Dashboard.
2. **Disable Unnecessary Redirects**  
   - Update your web server’s config to avoid rewriting or appending slashes.  
3. **Verify Domain Settings**  
   - Sometimes domain-level configurations add or remove `www` automatically. Make sure Stripe’s endpoint matches your real final domain.

---

## Key Takeaways
- **Any 3xx is a Fail**: Stripe explicitly considers redirects as failures for webhook delivery.  
- **Match the Exact URL**: The shortest route to success is using the exact final endpoint, including protocol (HTTPS), domain (www vs. non-www), and trailing slash.  
- **Double-Check Environment**: If you have multiple environments (staging vs. production), ensure each one uses the correct final URL in Stripe’s settings.

---

## Additional Resources

- **[Mitigating Stripe Webhook Failures](/blog/mitigating-stripe-webhook-failures)**: See how you can proactively avoid common endpoint problems.  
- **[Webhooks: What to Do When the HTTP Status Code Starts with a Four (4xx) or Five (5xx)](/blog/webhooks-4xx-5xx)**: Learn to handle errors caused by server or code misconfigurations.

---

## Conclusion
3xx responses are a simple—but often overlooked—issue that breaks webhook deliveries. Making sure you provide Stripe with the final, non-redirecting URL can save you hours of troubleshooting. Check out our other articles for 4xx/5xx guidance and best practices on preventing webhook mishaps altogether.