import { GetproductTotals } from "@/app/actions/admin/productAction";
import { auth } from "@/lib/auth";
import { request } from "http";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return NextResponse.redirect(new URL("/auth", request.url));

  if (session && session.user.role !== "admin")
    return NextResponse.json(
      {
        success: false,
        message: "You are not authorized to make this request",
      },
      { status: 401 }
    );

  try {
    const res = await GetproductTotals();
    res.res;

    if (res.success) {
      return NextResponse.json({ ...res }, { status: 200 });
    }

    return NextResponse.json(
      { success: false, message: "Error occured, please try again" },
      { status: 401 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: "Error occured, please try again" },
      { status: 401 }
    );
  }
}
