import { GetSingleProductActions } from "@/app/actions/userActions/ProductActionsUser";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const productId = (await params).productId;

  if (!productId)
    return NextResponse.json(
      { status: false, message: "Product Id not provided" },
      { status: 500 }
    );

  const res = await GetSingleProductActions(productId);

  return NextResponse.json({ status: true, data: res }, { status: 200 });
}
