import { authOptions } from "@/auth/authOptions";
import loggerServer from "@/loggerServer";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { v4 } from "uuid";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in to connect your Stripe account." },
      { status: 403 },
    );
  }
  try {
    const clientId = process.env.STRIPE_CLIENT_ID as string;
    const callbackUrl = process.env.STRIPE_CALLBACK_URL as string;
    const state = v4();
    const args = new URLSearchParams({
      state,
      client_id: clientId,
      scope: "read_write",
      response_type: "code",
      redirect_uri: callbackUrl,
    });

    const url = `https://connect.stripe.com/oauth/authorize?${args.toString()}`;
    const response = NextResponse.json({ url });

    response.cookies.set("state", state, {
      httpOnly: true, // Accessible by the server
      secure: process.env.NODE_ENV === "production", // HTTPS only
      // sameSite: "strict", // Set on the same domain
    });

    return response;
  } catch (err: any) {
    loggerServer.error(err);
    return NextResponse.json(
      { error: "An unknown error occurred." },
      { status: 500 },
    );
  }
}
