import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { env } from "../../../../../env";
import { SaveOrderToDatabaseAction } from "@/app/actions/paypal/paypal";

// Second action
export async function GET(request: NextRequest) {
  const searchRequest = request.nextUrl.searchParams;
  const assetId = searchRequest.get("assetId");
  const token = searchRequest.get("token");
  const payerId = searchRequest.get("PayerID");

  if (!assetId || !token || !payerId) {
    return NextResponse.redirect(
      new URL(`/gallery/${assetId}?missinParams=true`, request.url)
    );
  }

  // session

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  try {
    if (!session?.user.id) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const orderEndpoint = `${env.PAYPAL_ENDPOINT}/v2/checkout/orders/${token}/capture`;

    const res = await fetch(orderEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    });

    const data = await res.json();
    console.log(data, "Payment capture");

    if (data.status === "COMPLETED") {
      // Database action here

      const reference_id = data.purchase_units[0]?.reference_id;

      const saveToDB = await SaveOrderToDatabaseAction({
        paypalOrderId: token,
        userId: session.user.id,
        referenceId: reference_id,
      });

      if (!saveToDB.status) {
        return NextResponse.redirect(
          new URL(`/products/${assetId}?error=recording_failed`, request.url)
        );
      }
      return NextResponse.redirect(
        new URL(`/products/${assetId}?success=true `, request.url)
      );
    } else {
      return NextResponse.redirect(
        new URL(`/products/${assetId}?error=payment_failed`, request.url)
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(
      new URL(`/products/${assetId}?error=server_error`, request.url)
    );
  }
}
