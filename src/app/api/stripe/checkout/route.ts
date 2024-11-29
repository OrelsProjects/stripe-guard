import { getStripeInstance } from "@/app/api/_payment/stripe";
import { authOptions } from "@/auth/authOptions";
import loggerServer from "@/loggerServer";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const nextUrl = req.nextUrl;
    const { priceId, productId } = await req.json();
    const stripe = getStripeInstance();

    const product = await stripe.products.retrieve(productId);

    const noCreditCard = product.metadata.noCreditCard === "true";

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: noCreditCard ? [] : ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        trial_period_days: 14,
        trial_settings: {
          end_behavior: {
            missing_payment_method: "cancel",
          },
        },
      },
      payment_method_collection: "if_required",
      success_url: `${nextUrl.origin}/api/stripe/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${nextUrl.origin}/cancel`,
      client_reference_id: session.user.userId,
      customer_email: session.user.email || "",
      metadata: {
        productId,
        priceId,
      },
    });
    return NextResponse.json({ sessionId: stripeSession.id }, { status: 200 });
  } catch (error: any) {
    loggerServer.error(
      "Error creating a checkout session",
      session?.user?.userId || "Unknown user",
      error,
    );
    return NextResponse.json(
      { error: "Error creating a checkout session" },
      { status: 500 },
    );
  }
}
