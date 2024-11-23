// api/subscription

import { NextRequest, NextResponse } from "next/server";
import Logger from "@/loggerServer"; 
import { getServerSession } from "next-auth";
import { SubscriptionId } from "@/models/payment";
import prisma from "@/app/api/_db/db";
import { authOptions } from "@/auth/authOptions";
import { getSubscription } from "@/app/api/_utils/payments";

/**
 * POST Handler for processing PayPal subscription verification and saving the subscription details to the database.
 *
 * This API endpoint is intended to:
 * - Authenticate the incoming request to ensure the user is logged in.
 * - Retrieve PayPal subscription details using the provided subscription ID.
 * - Validate the response to check if the subscription data is valid.
 * - Save subscription data to the database, including important billing details.
 * - Log any errors that occur during the process for better traceability.
 *
 * @param {NextRequest} req - The incoming HTTP request object.
 * @returns {Promise<NextResponse>} A response object with the result of the operation.
 */
export async function POST(req: NextRequest) {
  // Get the current session using NextAuth for authentication
  const session = await getServerSession(authOptions);

  // Return 401 Unauthorized response if no valid session is found
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse the request body to extract the subscription ID
    const { subscriptionId }: { subscriptionId: SubscriptionId } =
      await req.json();

    // Fetch subscription details from PayPal using the extracted subscription ID
    const subscriptionData = await getSubscription(subscriptionId);

    // If the subscription data is not valid, log the error and return a 401 response
    if (!subscriptionData) {
      Logger.error("Failed to verify subscription", session.user.userId, {
        data: { subscriptionId },
      });
      return NextResponse.json(
        { error: "Failed to verify subscription" },
        { status: 401 },
      );
    }

    // Extract billing information from the subscription data
    const next_billing_time = subscriptionData.billing_info?.next_billing_time;
    const last_payment = subscriptionData.billing_info?.last_payment;

    // Create a new subscription record in the database using Prisma ORM
    const newSubscription = await prisma.subscription.create({
      data: {
        userId: session.user.userId, // Link the subscription to the authenticated user
        planId: subscriptionData.plan_id, // Store the plan ID associated with the subscription
        subscriptionId: subscriptionData.id, // Unique subscription ID from PayPal
        startDate: new Date(subscriptionData.start_time), // Start date of the subscription
        status: subscriptionData.status, // Current status of the subscription (e.g., "ACTIVE")
        nextBillingDate: next_billing_time ? new Date(next_billing_time) : null, // Next billing date if available
        lastPaymentDate: last_payment ? new Date(last_payment.time) : null, // Date of the last payment if available
        lastPaymentAmount: last_payment?.amount?.value
          ? parseFloat(last_payment.amount.value) // Last payment amount if available, parsed to a float
          : null,
      },
    });

    // Return a success response with the ID of the newly created subscription record
    return NextResponse.json({ id: newSubscription.id }, { status: 200 });
  } catch (error) {
    // Log the error for further investigation and return a 500 Internal Server Error response
    Logger.error("Error sending notification", session.user.userId, {
      data: { error },
    });
    return NextResponse.json(
      { error: "Error sending notification" },
      { status: 500 },
    );
  }
}
