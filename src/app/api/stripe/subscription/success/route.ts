import prisma from "@/app/api/_db/db";
import { getStripeInstance } from "@/app/api/_payment/stripe";
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

    await prisma.payment.create({
      data: {
        sessionId,
        productId,
        priceId,
        productName: product.name,
        tokensAdded: tokens,
        status: session.payment_status,
        amountReceived: (price.unit_amount as number) / 100,
        currency: price.currency as string,
        appUser: {
          connect: { id: userId },
        },
      },
    });

    // increase users tokens by the amount of tokens in the product
    await prisma.userTokens.upsert({
      where: {
        userId,
      },
      create: {
        userId,
        tokensLeft: tokens,
      },
      update: {
        tokensLeft: {
          increment: tokens,
        },
      },
    });

    await prisma.userMetadata.update({
      where: {
        userId,
      },
      data: {
        paidStatus: "paid",
      },
    });

    const newUserTokens = await prisma.userTokens.findUnique({
      where: {
        userId,
      },
      select: {
        tokensLeft: true,
      },
    });

    return NextResponse.redirect(
      req.nextUrl.origin +
        `/dashboard?success=true&tokens=${tokens}&total=${newUserTokens?.tokensLeft || tokens}`,
    );
  } catch (error: any) {
    loggerServer.error(
      "Failed to complete subscription",
      "stripe callback",
      error,
    );
    return NextResponse.redirect(req.nextUrl.origin + "/premium");
  }
}

//"\nInvalid `prisma.payment.create()` invocation:\n\n{\n  data: {\n    sessionId: \"cs_test_a1WiUx1g22blDdhM3bGDaTwRSmcQhlw3SpXsmY9aXyexTjcK7BNwduvk7p\",\n    productId: \"prod_RL2PfOjEtczQ8F\",\n    priceId: \"price_1QSMKmRxhYQDfRYG5MBZo00I\",\n    status: \"paid\",\n    invoiceId: null,\n    amountReceived: 219,\n    currency: \"usd\",\n    appUser: {\n      connect: {\n        id: \"cm3y7oujq0000k85c1h4yoog5\"\n      }\n    },\n+   customerId: String\n  }\n}\n\nArgument `customerId` must not be null."
