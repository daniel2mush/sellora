'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { collectionItems, collections, products } from '@/lib/db/schema'
import { and, count, eq, or, sql } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function AddProductToCollection({
  productId,
  collectionId,
}: {
  productId: string
  collectionId: string
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session)
    return {
      status: false,
      message: 'You are not authorized, please login to continue',
    }

  if (!productId || !collectionId)
    return {
      status: false,
      message: 'Please provide productId and a collection Name',
    }

  try {
    await db.insert(collectionItems).values({
      productId,
      collectionId,
    })

    return {
      status: true,
      message: 'Product Added to Collection',
    }
  } catch (error) {
    console.log(error)
    return {
      status: false,
      message: 'Error occured while adding product to collection',
    }
  }
}

export async function CreateACollection(collectionName: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session)
    return {
      status: false,
      message: 'You are not authorized, please login to continue',
    }

  try {
    // checking if that collection already exists with the same name
    await db.insert(collections).values({
      userId: session.user.id,
      collectionName,
    })
    return {
      status: true,
      message: 'Collection created successfully',
    }
  } catch (error) {
    console.log(error)
    return {
      status: false,
      message: 'Error occured while creating collection',
    }
  }
}

export async function GetAllUserCollection() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session)
    return {
      status: false,
      message: 'You are not authorized, please login to continue',
    }

  try {
    const userCollection = await db
      .select()
      .from(collections)
      .where(eq(collections.userId, session.user.id))

    return userCollection
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function CollectionItemsChecker(productId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session)
    return {
      status: false,
      message: 'You are not authorized, please login to continue',
    }

  try {
    const collectionItemsRes = await db
      .select()
      .from(collectionItems)
      .where(eq(collectionItems.productId, productId))

    return collectionItemsRes
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function GetAllUserCollectionWithProductCount(collectionId?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return {
      status: false,
      message: 'You are not authorized, please login to continue',
    }
  }

  try {
    // ✅ Build condition dynamically
    const conditions = [eq(collections.userId, session.user.id)]
    if (collectionId) {
      conditions.push(eq(collections.id, collectionId))
    }

    // 1. Get collection info + product count
    const collectionsWithCounts = await db
      .select({
        collectionId: collections.id,
        collectionName: collections.collectionName,
        productCount: sql<number>`count(${products.id})`.as('productCount'),
      })
      .from(collections)
      .leftJoin(collectionItems, eq(collectionItems.collectionId, collections.id))
      .leftJoin(products, eq(products.id, collectionItems.productId))
      .where(and(...conditions))
      .groupBy(collections.id)
      .orderBy(sql`count(${products.id}) DESC`)

    // 2. Get products for a specific collection (only if collectionId is provided)
    let productsInCollection: any[] = []
    if (collectionId) {
      productsInCollection = await db
        .select({
          productId: products.id,
          thumbnail: products.thumbnailUrl,
          name: products.title,
          price: products.price,
        })
        .from(collectionItems) // ✅ start from collectionItems
        .innerJoin(products, eq(products.id, collectionItems.productId)) // ✅ correct join
        .where(eq(collectionItems.collectionId, collectionId)) // ✅ filter by param
    }

    // console.log(collectionsWithCounts)
    console.log(collectionsWithCounts)
    return {
      collectionsWithCounts,
      productsInCollection,
    }
  } catch (error) {
    console.log(error)
    return []
  }
}

// Edit Collection

export async function EditCollectionAction({
  collectionId,
  collectionName,
}: {
  collectionId: string
  collectionName: string
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return {
      status: false,
      message: 'You are not authorized, please login to continue',
    }
  }

  try {
    // Checking if the user is authorized to edit the collection

    const [isAuthorized] = await db
      .select()
      .from(collections)
      .where(eq(collections.id, collectionId))

    // check if there is a collection
    if (!isAuthorized)
      return {
        status: false,
        message: 'There is no collection with this id',
      }

    if (isAuthorized.userId !== session.user.id) {
      return {
        status: false,
        message: 'You are not authorized to edit this collection.',
      }
    }

    // now edit the collection

    await db
      .update(collections)
      .set({
        collectionName,
      })
      .where(eq(collections.id, isAuthorized.id))

    return {
      status: true,
      message: 'Collection updated successfully',
    }
  } catch (error) {
    console.log(error)
    return {
      status: false,
      message: 'Error occured while updating collection',
    }
  }
}

//Delete Collection

export async function DeleteCollectionAction({ collectionId }: { collectionId: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return {
      status: false,
      message: 'You are not authorized, please login to continue',
    }
  }

  try {
    // Checking if the user is authorized to edit the collection

    const [isAuthorized] = await db
      .select()
      .from(collections)
      .where(eq(collections.id, collectionId))

    // check if there is a collection
    if (!isAuthorized)
      return {
        status: false,
        message: 'There is no collection with this id',
      }

    if (isAuthorized.userId !== session.user.id) {
      return {
        status: false,
        message: 'You are not authorized to delete this collection.',
      }
    }

    // now edit the collection

    await db.delete(collections).where(eq(collections.id, isAuthorized.id))

    return {
      status: true,
      message: 'Collection deleted successfully',
    }
  } catch (error) {
    console.log(error)
    return {
      status: false,
      message: 'Error occured while deleting collection',
    }
  }
}
