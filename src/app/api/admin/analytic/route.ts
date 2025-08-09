import { GetSalesAnalytics } from "@/app/actions/admin/analytics/getSaleAnalytics";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = new Date(searchParams.get("from") || "");
  const to = new Date(searchParams.get("to") || "");

  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    return NextResponse.json(
      { success: false, message: "Invalid date range" },
      { status: 400 }
    );
  }

  const result = await GetSalesAnalytics(from, to);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: result.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: result.data });
}
