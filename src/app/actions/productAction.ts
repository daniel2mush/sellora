"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { assets, orderItems, orders, products } from "@/lib/db/schema";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z, { success } from "zod";
import { id } from "zod/v4/locales";

const ProductSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  thumbnailUrl: z.string(),
  assetUrl: z.string(),
  publicId: z.string(),
  assetType: z.string(),
  assetSize: z.number(),
  category: z.enum(["psd", "photo", "png", "svg", "template", "vector"]),
});

export async function addNewProductAction(form: FormData) {
  // Product information
  const title = form.get("title");
  const description = form.get("description");
  const price = form.get("price");
  const thumbnailUrl = form.get("thumbnailUrl");
  const assetUrl = form.get("assetUrl");
  const assetType = form.get("assetType");
  const publicId = form.get("publicId");
  const assetSize = form.get("assetSize");
  const category = form.get("category");

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return {
      success: false,
      message: "You have to be logged in to add a product",
    };

  if (session && session.user.role !== "admin")
    return {
      success: false,
      message: "You are not authorized to make this request",
    };
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
    });

    const [newProduct] = await db
      .insert(products)
      .values({
        title: data.title,
        description: data.description,
        price: data.price,
        thumbnailUrl: data.thumbnailUrl,
        createdAt: new Date(),
        userId: session.user.id,
      })
      .returning();

    // adding the asset

    const [newAsset] = await db
      .insert(assets)
      .values({
        productId: newProduct.id,
        url: data.assetUrl,
        type: data.assetType,
        size: data.assetSize,
        publicId: data.publicId,
        createdAt: new Date(),
        category: data.category,
      })
      .returning();

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/dashboard/products");
    revalidatePath("/products");

    return {
      success: true,
      message: "Product added successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Error occured, please try again",
    };
  }
}

export async function getProductsActions(searchQuery?: boolean | undefined) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return {
      success: false,
      message: "You have to be logged in to add a product",
    };

  if (session && session.user.role !== "admin")
    return {
      success: false,
      message: "You are not authorized to make this request",
    };

  const conditions = [eq(products.userId, session.user.id)];

  if (searchQuery) {
    conditions.push(eq(products.isPublished, true));
  }
  if (searchQuery === false) {
    conditions.push(eq(products.isPublished, false));
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
      .orderBy(desc(products.createdAt));

    return productsData;
  } catch (error) {
    console.log(error);

    return [];
  }
}

export async function PublishProductAction(productId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return {
      success: false,
      message: "You have to be logged in to add a product",
    };

  if (session && session.user.role !== "admin")
    return {
      success: false,
      message: "You are not authorized to make this request",
    };

  // check if the user is authorized to publish a product

  try {
    const [value] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    if (value.userId !== session.user.id) {
      return {
        success: false,
        message: "You are not authorized to make this change",
      };
    }

    await db
      .update(products)
      .set({
        isPublished: true,
      })
      .where(eq(products.id, productId));

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/admin/dashboard");
    revalidatePath("/products");

    return {
      success: true,
      message: "Product has been published",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Error occured, please try again",
    };
  }
}

const ProductVerify = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  thumbnailUrl: z.string().optional(),
});

export async function EditProductAction(productId: string, { ...args }) {
  const productData = ProductVerify.parse({ ...args });
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return {
      success: false,
      message: "You have to be logged in to add a product",
    };

  if (session && session.user.role !== "admin")
    return {
      success: false,
      message: "You are not authorized to make this request",
    };

  try {
    const [value] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    if (value.userId !== session.user.id) {
      return {
        success: false,
        message: "You are not authorized to make this change",
      };
    }

    // Chage the product

    console.log(productData.thumbnailUrl, "Thumbnail");

    const res = await db
      .update(products)
      .set({
        ...productData,
      })
      .where(eq(products.id, productId))
      .returning();

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/admin/dashboard");
    revalidatePath("/products");

    return {
      success: true,
      message: "Product updated successfuly",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error occured please try again later",
    };
  }
}

export async function DeleteProductActions({
  productId,
}: {
  productId: string;
}) {
  console.log(productId, "PRoduct Id");

  const idSchema = z.object({
    productId: z.string(),
  });

  const { productId: productIdVerified } = idSchema.parse({
    productId: productId,
  });
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return {
      success: false,
      message: "You have to be logged in to add a product",
    };

  if (session && session.user.role !== "admin")
    return {
      success: false,
      message: "You are not authorized to make this request",
    };

  try {
    const [value] = await db
      .select()
      .from(products)
      .where(eq(products.id, productIdVerified));

    if (value.userId !== session.user.id) {
      return {
        success: false,
        message: "You are not authorized to make this change",
      };
    }
    console.log(value.id, "Product");
    await db.delete(assets).where(eq(assets.productId, productIdVerified));

    await db.delete(products).where(eq(products.id, productIdVerified));

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/admin/dashboard");
    revalidatePath("/products");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (e) {
    return {
      success: false,
      message: "Error occured please try again",
    };
  }
}

export async function GetAssetPublicIdAction(productId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return {
      success: false,
      message: "You have to be logged in to add a product",
    };

  if (session && session.user.role !== "admin")
    return {
      success: false,
      message: "You are not authorized to make this request",
    };
  try {
    const [value] = await db
      .select({ publicId: assets.publicId })
      .from(assets)
      .where(eq(assets.productId, productId));

    return {
      public_id: value.publicId,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error occured please try again later",
    };
  }
}
