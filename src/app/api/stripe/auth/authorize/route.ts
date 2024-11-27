import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { authOptions } from "@/auth/authOptions";
import { getServerSession } from "next-auth";
import prisma from "@/app/api/_db/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// function decryptData(data: Stripe.OAuthToken) {
//   const encryptionKey = process.env.STRIPE_ENCRYPTION_KEY as string;
//   const decryptedToken = CryptoJS.AES.decrypt(
//     data.access_token as string,
//     encryptionKey,
//   ).toString(CryptoJS.enc.Utf8);
//   const decryptedRefreshToken = CryptoJS.AES.decrypt(
//     data.refresh_token as string,
//     encryptionKey,
//   ).toString(CryptoJS.enc.Utf8);

//   const decryptedConnectedAccountId = CryptoJS.AES.decrypt(
//     data.stripe_user_id as string,
//     encryptionKey,
//   ).toString(CryptoJS.enc.Utf8);

//   return {
//     ...data,
//     access_token: decryptedToken,
//     refresh_token: decryptedRefreshToken,
//     stripe_user_id: decryptedConnectedAccountId,
//   };
// }

async function initHooks(data: Stripe.OAuthToken, userId: string) {
  // Init hooks for payment failures
  const userStripe = new Stripe(data.access_token as string);
  // await userStripe.webhookEndpoints.create({
  //   url: `${process.env.NEXTAUTH_URL}/api/stripe/webhook`,
  //   enabled_events: ["payment_intent.payment_failed"],
  // });

  const events = await userStripe.events.list({
    limit: 100, // Customize the number of events to fetch
  });
  const x = 4;
}

async function saveAccountId(data: Stripe.OAuthToken, userId: string) {
  // const encryptedData = encryptData(data);

  await prisma.userStripeCredentials.upsert({
    where: { userId },
    create: {
      userId,
      accountId: data.stripe_user_id,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      publishableKey: data.stripe_publishable_key,
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

    await initHooks(oauthToken, userId);

    // Redirect to a success page
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  } catch (err: any) {
    if (err.type === "StripeInvalidGrantError") {
      return NextResponse.json(
        { error: `Invalid authorization code: ${err.message}` },
        { status: 400 },
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: "An unknown error occurred." },
      { status: 500 },
    );
  }
}
