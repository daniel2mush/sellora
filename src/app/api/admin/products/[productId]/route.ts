import {
  DeleteProductActions,
  UpdateProductAction,
} from "@/app/actions/admin/productAction";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
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
  const productId = (await params).productId;

  console.log(productId, "Delete product id");

  try {
    const res = await DeleteProductActions({ productId });
    if (res.success) {
      return NextResponse.json({
        status: true,
        message: "Product deleted successfully",
      });
    }
    return NextResponse.json(
      { success: false, message: "Error occured, please try again " },
      { status: 500 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Error occured, please try again " },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
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

  const productId = (await params).productId;
  const body = await request.json();

  try {
    const res = await UpdateProductAction(productId, { ...body });

    if (res.success) {
      return NextResponse.json({ ...res }, { status: 200 });
    }

    console.log(res.message, "Res response");

    return NextResponse.json(
      { success: false, message: "Error occured, please try again " },
      { status: 500 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Error occured, please try again " },
      { status: 500 }
    );
  }
}
