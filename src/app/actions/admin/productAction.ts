'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { assets, downloads, products, purchase, purchaseItems, user } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import z from 'zod'

const ProductSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  thumbnailUrl: z.string(),
  assetUrl: z.string(),
  publicId: z.string(),
  assetType: z.string(),
  assetSize: z.number(),
  category: z.enum(['psd', 'photo', 'png', 'svg', 'template', 'vector']),
})

export async function addNewProductAction(form: FormData) {
  // Product information
  const title = form.get('title')
  const description = form.get('description')
  const price = form.get('price')
  const thumbnailUrl = form.get('thumbnailUrl')
  const assetUrl = form.get('assetUrl')
  const assetType = form.get('assetType')
  const publicId = form.get('publicId')
  const assetSize = form.get('assetSize')
  const category = form.get('category')

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session)
    return {
      success: false,
      message: 'You have to be logged in to add a product',
    }

  if (session && session.user.role !== 'admin')
    return {
      success: false,
      message: 'You are not authorized to make this request',
    }
  try {
    const data = ProductSchema.parse({
      title,
      description,
      price: Number(price),
      thumbnailUrl,
      assetUrl,
      publicId,
      assetType,
      assetSize: Number(assetSize),
      category,
    })

    const [newProduct] = await db
      .insert(products)
      .values({
        title: data.title,
        description: data.description,
        price: data.price,
        thumbnailUrl: data.thumbnailUrl,
        createdAt: new Date(),
        userId: session.user.id,
        updatedAt: new Date(),
      })
      .returning()

    // adding the asset

    await db
      .insert(assets)
      .values({
        productId: newProduct.id,
        url: data.assetUrl,
        type: data.assetType,
        size: data.assetSize,
        publicId: data.publicId,
        createdAt: new Date(),
        category: data.category,
        updatedAt: new Date(),
      })
      .returning()

    // revalidatePath("/admin/dashboard");
    // revalidatePath("/admin/dashboard/products");
    // revalidatePath("/products");

    return {
      success: true,
      message: 'Product added successfully',
    }
  } catch (error) {
    console.log(error)

    return {
      success: false,
      message: 'Error occured, please try again',
    }
  }
}

export async function getProductsActions(searchQuery?: boolean | undefined) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session)
    return {
      success: false,
      message: 'You have to be logged in to add a product',
    }

  if (session && session.user.role !== 'admin')
    return {
      success: false,
      message: 'You are not authorized to make this request',
    }

  const conditions = [eq(products.userId, session.user.id)]

  if (searchQuery) {
    conditions.push(eq(products.isPublished, true))
  }
  if (searchQuery === false) {
    conditions.push(eq(products.isPublished, false))
  }

  //   if (searchQuery && searchQuery.trim() !== "") {
  //   // Create individual ilike conditions safely
  //   const nameCondition = ilike(products.name, `%${searchQuery}%`);
  //   const descriptionCondition = ilike(products.description, `%${searchQuery}%`);

  //   // Only push the OR condition if both are defined
  //   if (nameCondition && descriptionCondition) {
  //     conditions.push(or(nameCondition, descriptionCondition));
  //   }
  // }

  try {
    const productsData = await db
      .select()
      .from(products)

      .where(and(...conditions))
      .orderBy(desc(products.createdAt))

    return productsData
  } catch (error) {
    console.log(error)

    return []
  }
}

export async function PublishProductAction(productId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session)
    return {
      success: false,
      message: 'You have to be logged in to add a product',
    }

  if (session && session.user.role !== 'admin')
    return {
      success: false,
      message: 'You are not authorized to make this request',
    }

  // check if the user is authorized to publish a product

  try {
    const [value] = await db.select().from(products).where(eq(products.id, productId))

    if (value.userId !== session.user.id) {
      return {
        success: false,
        message: 'You are not authorized to make this change',
      }
    }

    await db
      .update(products)
      .set({
        isPublished: true,
      })
      .where(eq(products.id, productId))

    // revalidatePath("/admin/dashboard/products");
    // revalidatePath("/admin/dashboard");
    // revalidatePath("/products");

    return {
      success: true,
      message: 'Product has been published',
    }
  } catch (error) {
    console.log(error)

    return {
      success: false,
      message: 'Error occured, please try again',
    }
  }
}

const ProductVerify = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  thumbnailUrl: z.string().optional(),
})

export async function UpdateProductAction(productId: string, { ...args }) {
  const productData = ProductVerify.parse({ ...args })
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session)
    return {
      success: false,
      message: 'You have to be logged in to add a product',
    }

  if (session && session.user.role !== 'admin')
    return {
      success: false,
      message: 'You are not authorized to make this request',
    }

  try {
    const [value] = await db.select().from(products).where(eq(products.id, productId))

    if (value.userId !== session.user.id) {
      return {
        success: false,
        message: 'You are not authorized to make this change',
      }
    }

    // Chage the product

    console.log(productData.thumbnailUrl, 'Thumbnail')

    await db
      .update(products)
      .set({
        ...productData,
      })
      .where(eq(products.id, productId))
      .returning()

    revalidatePath('/admin/dashboard/products')
    revalidatePath('/admin/dashboard')
    revalidatePath('/products')

    return {
      success: true,
      message: 'Product updated successfuly',
    }
  } catch (error) {
    console.log(error)

    return {
      success: false,
      message: 'Error occured please try again later',
    }
  }
}

export async function DeleteProductActions({ productId }: { productId: string }) {
  console.log('Deleting product with ID:', productId)

  const idSchema = z.object({
    productId: z.string(),
  })

  const { productId: productIdVerified } = idSchema.parse({
    productId: productId,
  })
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session)
    return {
      success: false,
      message: 'You have to be logged in to add a product',
    }

  if (session && session.user.role !== 'admin')
    return {
      success: false,
      message: 'You are not authorized to make this request',
    }

  try {
    const [value] = await db.select().from(products).where(eq(products.id, productIdVerified))

    if (value.userId !== session.user.id) {
      return {
        success: false,
        message: 'You are not authorized to make this change',
      }
    }
    // console.log(value.id, "Product");

    // finding asset
    const [asset] = await db.select().from(assets).where(eq(assets.productId, productId))

    if (asset) {
      await db.delete(downloads).where(eq(downloads.assetId, asset.id))
    }
    await db.delete(assets).where(eq(assets.productId, productIdVerified))

    await db.delete(products).where(eq(products.id, productIdVerified))

    return {
      success: true,
      message: 'Product deleted successfully',
    }
  } catch (e) {
    console.log(e)

    return {
      success: false,
      message: 'Error occured please try again',
    }
  }
}

export async function GetAssetPublicIdAction(productId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session)
    return {
      success: false,
      message: 'You have to be logged in to add a product',
    }

  if (session && session.user.role !== 'admin')
    return {
      success: false,
      message: 'You are not authorized to make this request',
    }
  try {
    const [value] = await db
      .select({ publicId: assets.publicId })
      .from(assets)
      .where(eq(assets.productId, productId))

    return {
      public_id: value.publicId,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error occured please try again later',
    }
  }
}

export async function GetproductTotals() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session)
    return {
      success: false,
      message: 'You have to be logged in to add a product',
    }

  if (session && session.user.role !== 'admin')
    return {
      success: false,
      message: 'You are not authorized to make this request',
    }

  try {
    const res = await db
      .select({
        products,
        purchaseItems,
        user,
      })
      .from(products)
      .leftJoin(purchaseItems, eq(purchaseItems.productId, products.id))
      .leftJoin(purchase, eq(purchase.id, purchaseItems.purchaseId))
      .leftJoin(user, eq(user.id, purchase.userId))
      .where(eq(products.userId, session.user.id))

    return {
      success: true,
      res,
    }
  } catch (error) {
    console.error(error)

    return {
      success: false,
      message: 'Error occured while fetching products, please try again',
    }
  }
}

// export async function GetAllPaidProductAction() {

//    const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   if (!session)
//     return {
//       success: false,
//       message: "You have to be logged in to add a product",
//     };

//   if (session && session.user.role !== "admin")
//     return {
//       success: false,
//       message: "You are not authorized to make this request",
//     };

//   try {

//     const res = await db.select().from(purchaseItems).where(eq(purchaseItems.))

//   } catch (error) {

//   }

// }

// export async function GetSingleAdminProduct(productId: string) {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   if (!session)
//     return {
//       success: false,
//       message: "You have to be logged in to add a product",
//     };

//   if (session && session.user.role !== "admin")
//     return {
//       success: false,
//       message: "You are not authorized to make this request",
//     };

//   try {
//     const [res] = await db
//       .select()
//       .from(products)
//       .where(eq(products.id, productId));
//     return res;
//   } catch (error) {
//     return {};
//   }
// }
