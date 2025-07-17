"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { assets, products } from "@/lib/db/schema";
import { headers } from "next/headers";
import z from "zod";

const ProductSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  thumbnailUrl: z.string(),
  assetUrl: z.string(),
  publicId: z.string(),
  assetType: z.string(),
  assetSize: z.number(),
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

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return {
      status: false,
      message: "You have to be logged in to add a product",
    };

  if (session && session.user.role !== "admin")
    return {
      status: false,
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
      })
      .returning();

    return {
      status: true,
      message: "Product added successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      status: false,
      message: "Error occured, please try again",
    };
  }
}
