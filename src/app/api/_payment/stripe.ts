import Stripe from "stripe";

export const getStripeInstance = (
  data?:
    | {
        apiKey: string;
        accountId?: string;
      }
    | {
        apiKey?: string;
        accountId: string;
      },
) => {
  if (!data) {
    return new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  const { apiKey, accountId } = data;
  if (accountId) {
    return new Stripe(apiKey || (process.env.STRIPE_SECRET_KEY as string), {
      stripeAccount: accountId,
    });
  } else {
    return new Stripe(apiKey as string);
  }
};
