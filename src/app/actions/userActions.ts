"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const SetUserToAdminActions = async (userId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/auth");

  if (session.user.role === "admin")
    return {
      status: false,
      message: "You are already an admin user",
    };

  try {
    const data = await db
      .update(user)
      .set({
        role: "admin",
      })
      .where(eq(user.id, userId));
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/dashboard");

    return {
      status: true,
      message: "You have become an admin successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      status: false,
      message: "Error occured, please try again",
    };
  }
};
