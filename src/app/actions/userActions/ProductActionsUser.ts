import { db } from "@/lib/db";
import { assets, products, user } from "@/lib/db/schema";
import { and, desc, eq, gt, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type searchQueryProps =
  | "psd"
  | "photo"
  | "png"
  | "svg"
  | "template"
  | "vector";

export type LicenseType = "free license" | "pro license" | undefined;

export async function GetAllProductsActions(
  searchQuery: searchQueryProps | undefined,
  query: string | undefined,
  page: number = 1,
  pageSize: number = 10,
  license: LicenseType = undefined
) {
  const conditions = [eq(products.isPublished, true)];

  if (searchQuery) {
    conditions.push(eq(assets.category, searchQuery));
  }

  if (license === "free license") {
    conditions.push(eq(products.price, 0.0));
  } else if (license === "pro license") {
    conditions.push(gt(products.price, 0));
  }

  let whereClause;

  if (query) {
    const searchVector = sql`to_tsvector('english', ${products.title} || ' ' || ${products.description})`;
    const searchQuerySql = sql`plainto_tsquery('english', ${query})`;

    whereClause = and(
      ...conditions,
      or(
        sql`${searchVector} @@ ${searchQuerySql}`,
        sql`${products.title} ILIKE ${`%${query}%`}`,
        sql`${products.description} ILIKE ${`%${query}%`}`
      )
    );
  } else {
    whereClause = and(...conditions);
  }

  try {
    const productData = await db
      .select()
      .from(products)
      .innerJoin(user, eq(user.id, products.userId))
      .innerJoin(assets, eq(assets.productId, products.id))
      .where(whereClause)
      .orderBy(desc(products.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::integer` })
      .from(products)
      .innerJoin(assets, eq(assets.productId, products.id))
      .where(whereClause);

    return {
      products: productData,
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { products: [], total: 0, page, pageSize, totalPages: 0 };
  }
}

export async function GetSingleProductActions(id: string) {
  try {
    const [productData] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .innerJoin(user, eq(products.userId, user.id))
      .innerJoin(assets, eq(assets.productId, products.id));
    return productData;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function GetUserUploadsAction(userId: string) {
  try {
    const results = await db
      .select()
      .from(products)
      .where(eq(products.userId, userId));

    return {
      results,
      count: results.length,
    };
  } catch (error) {
    console.log(error);

    return {
      product: [],
      count: 0,
    };
  }
}
