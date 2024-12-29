import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { authOptions } from "@/auth/authOptions";
import { getServerSession } from "next-auth";
import prisma from "@/app/api/_db/db";
import { getStripeInstance } from "@/app/api/_payment/stripe";
import loggerServer from "@/loggerServer";

async function saveAccountId(data: Stripe.OAuthToken, userId: string) {
  await prisma.userStripeCredentials.upsert({
    where: { userId },
    create: {
      userId,
      accountId: data.stripe_user_id,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      publishableKey: data.stripe_publishable_key,
      connected: true,
    },
    update: {
      accountId: data.stripe_user_id,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      publishableKey: data.stripe_publishable_key,
    },
  });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in to connect your Stripe account." },
      { status: 403 },
    );
  }
  try {
    const stripe = getStripeInstance();
    const { searchParams } = req.nextUrl;
    const code = searchParams.get("code") as string;
    const state = searchParams.get("state") as string;

    const userId = session.user?.userId;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const sessionState = req.cookies.get("state")?.value; // Assuming state is stored in cookies
    if (sessionState !== state) {
      return NextResponse.json(
        { error: `Incorrect state parameter: ${state}` },
        { status: 403 },
      );
    }

    const oauthToken: Stripe.OAuthToken = await stripe.oauth.token({
      grant_type: "authorization_code",
      code,
    });

    await saveAccountId(oauthToken, userId);

    // Redirect to a success page
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  } catch (err: any) {
    if (err.type === "StripeInvalidGrantError") {
      return NextResponse.json(
        { error: `Invalid authorization code: ${err.message}` },
        { status: 400 },
      );
    }
    loggerServer.error(err);
    return NextResponse.json(
      { error: "An unknown error occurred." },
      { status: 500 },
    );
  }
}
