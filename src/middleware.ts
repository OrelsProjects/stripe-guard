import { ReferralOptions } from "global";
import { NextRequest, NextResponse } from "next/server";

const getReferralOptions = (req: NextRequest): ReferralOptions => {
  const { searchParams } = req.nextUrl;

  const referralCode = searchParams.get("referralCode");

  return {
    referralCode,
  };
};

export async function middleware(req: NextRequest) {
  const { referralCode } = getReferralOptions(req);

  if (referralCode) {
    const response = NextResponse.next();

    // expire in 1 week
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    if (referralCode) {
      response.cookies.set("referralCode", referralCode, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        expires: nextWeek,
      });
    }

    return response;
  }

  return NextResponse.next();
}

// match /register path and if it has params, also match
export const config = {
  matcher: "/register/:path*", // Matches /register and any subpaths
};

export { default } from "next-auth/middleware";
