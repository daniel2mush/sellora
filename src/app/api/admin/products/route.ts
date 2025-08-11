import {
  addNewProductAction,
  getProductsActions,
  PublishProductAction,
} from "@/app/actions/admin/productAction";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

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

  const searchParams = request.nextUrl.searchParams;

  const isPublished = searchParams.get("isPublished");

  let searchBool: boolean | undefined = undefined;
  if (isPublished === "true") searchBool = true;
  if (isPublished === "false") searchBool = false;

  try {
    const res = await getProductsActions(searchBool);

    return NextResponse.json({ success: true, products: res }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Error occured, please try again " },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

  const formData = await request.formData();

  const res = await addNewProductAction(formData);

  try {
    return NextResponse.json({ ...res }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Error occured, please try again " },
      { status: 500 }
    );
  }
}

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
