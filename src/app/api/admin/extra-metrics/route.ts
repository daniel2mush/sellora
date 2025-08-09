// app/api/admin/extra-metrics/route.ts

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { purchase, products, purchaseItems } from "@/lib/db/schema";
import { eq, between, and, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const from = new Date(searchParams.get("from") ?? "1970-01-01");
  const to = new Date(searchParams.get("to") ?? new Date().toISOString());

  try {
    // Total products uploaded by this seller/admin
    const [totalProducts] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(products)
      .where(eq(products.userId, session.user.id));

    // New unique customers within date range
    const [newCustomers] = await db
      .select({
        count: sql<number>`count(DISTINCT ${purchase.userId})`,
      })
      .from(purchase)
      .where(between(purchase.createdAt, from, to));

    // Total sales and income from this seller's products
    const [salesAndIncome] = await db
      .select({
        totalSales: sql<number>`count(${purchaseItems.id})`,
        totalIncome: sql<number>`coalesce(sum(${purchaseItems.price}), 0)`,
      })
      .from(purchaseItems)
      .innerJoin(products, eq(purchaseItems.productId, products.id))
      .where(
        and(
          between(purchaseItems.createdAt, from, to),
          eq(products.userId, session.user.id)
        )
      );

    return NextResponse.json({
      success: true,
      data: {
        totalProducts: totalProducts.count,
        newCustomers: newCustomers.count,
        totalSales: salesAndIncome.totalSales,
        totalIncome: salesAndIncome.totalIncome,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
