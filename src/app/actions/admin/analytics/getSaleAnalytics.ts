import { db } from "@/lib/db";
import { products, purchaseItems, purchase } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { between, eq, sql, and } from "drizzle-orm";

export async function GetSalesAnalytics(from: Date, to: Date) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return {
      success: false,
      message: "You must be logged in",
    };

  // You can restrict this if needed
  const userId = session.user.id;

  try {
    const res = await db
      .select({
        month: sql`TO_CHAR(${purchaseItems.createdAt}, 'Mon')`.as("month"),
        totalSales: sql<number>`COUNT(${purchaseItems.id})`.as("totalSales"),
        totalIncome: sql<number>`SUM(${purchaseItems.price})`.as("totalIncome"),
      })
      .from(purchaseItems)
      .innerJoin(products, eq(products.id, purchaseItems.productId))
      .where(
        and(
          eq(products.userId, userId), // restrict to only seller’s products
          between(purchaseItems.createdAt, from, to)
        )
      )
      .groupBy(sql`TO_CHAR(${purchaseItems.createdAt}, 'Mon')`)
      .orderBy(sql`MIN(${purchaseItems.createdAt})`);

    return {
      success: true,
      data: res,
    };
  } catch (error) {
    console.error("Analytics error:", error);
    return {
      success: false,
      message: "Failed to fetch analytics",
    };
  }
}
