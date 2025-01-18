import prisma from "@/app/api/_db/db";
import { getStripeInstance } from "@/app/api/_payment/stripe";
import { sendMail } from "@/app/api/_utils/mail/mail";
import { successfulTokensPurchaseEmail } from "@/app/api/_utils/mail/templates";
import loggerServer from "@/loggerServer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json({ error: "Invalid session_id" }, { status: 400 });
  }
  try {
    const stripe = getStripeInstance();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: "Invalid session_id" },
        { status: 400 },
      );
    }

    const userId = session.client_reference_id;
    const productId = session.metadata?.productId;
    const priceId = session.metadata?.priceId;

    if (!userId || !productId || !priceId) {
      return NextResponse.json(
        { error: "Invalid session_id" },
        { status: 400 },
      );
    }

    const product = await getStripeInstance().products.retrieve(productId);
    const price = await getStripeInstance().prices.retrieve(priceId);
    const tokens = parseInt(product.metadata.tokens || "40021");
    const amountReceived = (price.unit_amount as number) / 100;

    await prisma.payment.create({
      data: {
        sessionId,
        productId,
        priceId,
        productName: product.name,
        status: session.payment_status,
        amountReceived,
        currency: price.currency as string,
        appUser: {
          connect: { id: userId },
        },
      },
    });

    const user = await prisma.userStripeCredentials.findUnique({
      where: {
        userId: userId,
      },
      select: {
        connected: true,
        apiKey: true,
      },
    });

    const shouldOnboard = !user?.connected && !user?.apiKey;

    await sendMail(
      session.customer_email || "",
      process.env.NEXT_PUBLIC_APP_NAME as string,
      "Payment confirmation",
      successfulTokensPurchaseEmail(tokens, amountReceived),
    );

    return NextResponse.redirect(
      req.nextUrl.origin +
        `/dashboard?success=true&tokens=${tokens}${shouldOnboard ? "&onboard" : ""}`,
    );
  } catch (error: any) {
    loggerServer.error(
      "Failed to complete subscription",
      "stripe callback",
      error,
    );
    return NextResponse.redirect(req.nextUrl.origin + "/dashboard?error=true");
  }
}
