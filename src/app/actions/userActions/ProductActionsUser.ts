'use server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { assets, downloads, likes, products, purchase, purchaseItems, user } from '@/lib/db/schema'
import { and, desc, eq, or, sql } from 'drizzle-orm'
import { headers } from 'next/headers'

export type searchQueryProps = 'psd' | 'photo' | 'png' | 'svg' | 'template' | 'vector'

export async function GetAllProductsActions(
  searchQuery: searchQueryProps | undefined,
  query: string | undefined,
  page: number = 1,
  pageSize: number = 10
) {
  const conditions = [eq(products.isPublished, true)]

  if (searchQuery) {
    conditions.push(eq(assets.category, searchQuery))
  }

  let whereClause

  if (query) {
    const searchVector = sql`to_tsvector('english', ${products.title} || ' ' || ${products.description})`
    const searchQuerySql = sql`plainto_tsquery('english', ${query})`

    whereClause = and(
      ...conditions,
      or(
        sql`${searchVector} @@ ${searchQuerySql}`,
        sql`${products.title} ILIKE ${`%${query}%`}`,
        sql`${products.description} ILIKE ${`%${query}%`}`
      )
    )
  } else {
    whereClause = and(...conditions)
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
      .offset((page - 1) * pageSize)

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::integer` })
      .from(products)
      .innerJoin(assets, eq(assets.productId, products.id))
      .where(whereClause)

    return {
      products: productData,
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    }
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return { products: [], total: 0, page, pageSize, totalPages: 0 }
  }
}

export async function GetSingleProductActions(id: string) {
  try {
    const [productData] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .innerJoin(user, eq(products.userId, user.id))
      .innerJoin(assets, eq(assets.productId, products.id))
    return productData
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function GetUserUploadsAction(userId: string) {
  try {
    const results = await db.select().from(products).where(eq(products.userId, userId))

    return {
      results,
      count: results.length,
    }
  } catch (error) {
    console.log(error)

    return {
      product: [],
      count: 0,
    }
  }
}

export async function IsAlreadyBougth(productId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user)
    return {
      status: false,
      message: 'Log in to continue',
    }
  try {
    const res = await db
      .select()
      .from(purchaseItems)
      .innerJoin(purchase, eq(purchase.id, purchaseItems.purchaseId))
      .where(and(eq(purchaseItems.productId, productId), eq(purchase.userId, session.user.id)))
      .limit(1)

    return res.length > 0
  } catch (error) {
    console.log(error)

    return false
  }
}

export async function GetPurchaseItem(productId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user)
    return {
      status: false,
      message: 'Log in to continue',
    }
  try {
    const [res] = await db
      .select()
      .from(purchaseItems)
      .innerJoin(purchase, eq(purchase.id, purchaseItems.purchaseId))
      .where(and(eq(purchaseItems.productId, productId)))

    return {
      res,
    }
  } catch (error) {
    console.log(error)

    return {
      error: true,
      message: 'Error occured, please try agan',
    }
  }
}

export async function GetAssetActions(productId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user)
    return {
      status: false,
      message: 'Log in to continue',
    }

  try {
    const [res] = await db
      .select()
      .from(assets)
      .where(eq(assets.productId, productId))
      .innerJoin(products, eq(products.id, productId))

    return {
      status: true,
      assets: res,
    }
  } catch (error) {
    console.log(error)

    return {
      status: false,
      message: 'Error occured, please try agan',
    }
  }
}

export async function DownloadAction({ userId, assetId }: { userId: string; assetId: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user)
    return {
      status: false,
      message: 'Log in to continue',
    }
  try {
    await db.insert(downloads).values({
      userId,
      assetId,
    })

    return {
      status: true,
      message: 'Added to database successfully',
    }
  } catch (error) {
    console.log(error)
    return {
      status: false,
      message: 'Added to database successfully',
    }
  }
}

export async function GetAllPurchasedItems() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user)
    return {
      status: false,
      message: 'Log in to continue',
    }

  try {
    const res = await db
      .select({
        products: {
          id: products.id,
          title: products.title,
          thumbnail: products.thumbnailUrl,
        },
        purchaseItems: {
          price: purchaseItems.price,
          purchaseDate: purchaseItems.createdAt,
        },
        purchase,
      })
      .from(purchase)
      .innerJoin(purchaseItems, eq(purchaseItems.purchaseId, purchase.id))
      .innerJoin(products, eq(products.id, purchaseItems.productId))
      .where(eq(purchase.userId, session.user.id))

    return {
      status: true,
      res,
    }
  } catch (error) {
    console.log(error)
    return {
      status: false,
      message: 'Error occured while adding product to database',
    }
  }
}

export async function HasPurchasedHistory(productId: string) {
  try {
    const res = await db.select().from(purchaseItems).where(eq(purchaseItems.productId, productId))

    return res.length > 0
  } catch (error) {
    console.log(error)

    return false
  }
}

export async function GetTrendingImagesAction() {
  interface trendingProps {
    product_id: string
    title: string
    thumbnail_url: string
  }

  interface trending {
    rows: trendingProps[]
  }
  try {
    const trendingProducts = await db.execute(
      sql`
    SELECT 
  p.id AS product_id,
  p.title,
  p.thumbnail_url,
  COUNT(d.id) AS download_count
FROM downloads d
JOIN assets a ON d.asset_id = a.id
JOIN products p ON a.product_id = p.id
GROUP BY p.id, p.title, p.thumbnail_url
HAVING COUNT(d.id) >= 1
ORDER BY download_count DESC
LIMIT 8;
  `
    )

    return trendingProducts.rows
  } catch (error) {
    console.error('Failed to fetch trending images:', error)
    return []
  }
}

export const LikeProductAction = async (productId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session)
    return {
      status: false,
      message: 'You are not authorized, please login to continue',
    }

  try {
    await db.insert(likes).values({
      productId,
      userId: session.user.id,
    })

    return {
      status: true,
      message: 'Product liked successfully',
    }
  } catch (error) {
    console.log(error)
    return {
      status: false,
      message: 'Error occured while adding product to like',
    }
  }
}

export const UnLikeProductAction = async (productId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session)
    return {
      status: false,
      message: 'You are not authorized, please login to continue',
    }

  try {
    await db.delete(likes).where(eq(likes.productId, productId))

    return {
      status: true,
      message: 'Product Unliked successfully',
    }
  } catch (error) {
    console.log(error)
    return {
      status: false,
      message: 'Error occured while adding product to Unlike',
    }
  }
}

export const GetLikedProductAction = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session)
    return {
      status: false,
      message: 'You are not authorized, please login to continue',
    }

  try {
    const likedProducts = await db.select().from(likes).where(eq(likes.userId, session.user.id))

    return likedProducts
  } catch (error) {
    return []
  }
}
