"use server";

import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GetAllProductsActions() {
  try {
    const productData = await db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt))
      .where(eq(products.isPublished, true));

    return productData;
  } catch (error) {
    return [];
  }
}
