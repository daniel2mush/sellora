import {
  DeleteProductActions,
  PublishProductAction,
} from "@/app/actions/admin/productAction";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function PUT(request: NextRequest) {
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

  const idChecker = z.object({
    id: z.string(),
  });

  const body = await request.json();

  const validateID = idChecker.parse(body);

  try {
    const res = await PublishProductAction(validateID.id);
    return NextResponse.json({ ...res }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Error occured, please try again " },
      { status: 500 }
    );
  }
}
