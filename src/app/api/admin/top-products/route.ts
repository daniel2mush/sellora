// app/api/admin/top-products/route.ts
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { purchaseItems, products } from "@/lib/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const topProducts = await db
      .select({
        title: products.title,
        sales: sql<number>`count(${purchaseItems.productId})`.as("sales"),
      })
      .from(products)
      .leftJoin(purchaseItems, eq(purchaseItems.productId, products.id))
      .where(eq(products.userId, session.user.id))
      .groupBy(products.id)
      .orderBy(desc(sql<number>`sales`))
      .limit(5);

    return NextResponse.json({ success: true, data: topProducts });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch top products" },
      { status: 500 }
    );
  }
}
