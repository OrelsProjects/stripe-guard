import prisma from "@/app/api/_db/db";
import { getStripeInstance } from "@/app/api/_payment/stripe";
import loggerServer from "@/loggerServer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("session_id");
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Invalid session_id" },
        { status: 400 },
      );
    }
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

    await prisma.subscription.create({
      data: {
        userId,
        sessionId,
        productId,
        priceId,
        customerId: session.customer as string,
        status: session.payment_status,
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
    return NextResponse.redirect(req.nextUrl.origin + "/dashboard");
  } catch (error: any) {
    loggerServer.error(
      "Failed to complete subscription",
      "stripe callback",
      error,
    );
    return NextResponse.redirect(req.nextUrl.origin + "/premium");
  }
}
