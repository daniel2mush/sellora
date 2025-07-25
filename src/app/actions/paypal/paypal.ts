import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orderItems, orders, products } from "@/lib/db/schema";
import axios from "axios";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "../../../../env";

export async function CreatePaypalOrder(productId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/auth");

  try {
    // 1. Check if product exists
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    if (!product) {
      return {
        status: false,
        message: "No product found with this ID",
      };
    }

    // 2. Check if already purchased
    const alreadyBought = await db
      .select()
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(
        and(
          eq(orders.userId, session.user.id),
          eq(orderItems.productId, productId)
        )
      )
      .limit(1);

    if (alreadyBought.length > 0) {
      return {
        status: false,
        message: "Item is already purchased",
      };
    }

    // 3. Create PayPal order
    const res = await axios.post(
      `${env.PAYPAL_ENDPOINT}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: product.id,
            description: `Purchase of ${product.title}`,
            amount: {
              currency_code: "USD",
              value: (product.price / 100).toFixed(2),
            },
            custom_id: `${session.user.id}:${product.id}`,
          },
        ],
        application_context: {
          return_url: `${env.BASE_URL}/api/paypal/capture?assetId=${product.id}`,
          cancel_url: `${env.BASE_URL}/products/${product.id}?cancelled=true`,
        },
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 4. Extract approval URL
    const approvalUrl = res.data.links.find(
      (link: any) => link.rel === "approve"
    )?.href;

    return {
      status: true,
      approvalUrl,
      orderId: res.data.id,
    };
  } catch (error: any) {
    console.error(
      "PayPal Order Error:",
      error?.response?.data || error.message
    );
    return {
      status: false,
      message: "Something went wrong while creating the PayPal order.",
    };
  }
}

// export const orders = pgTable("orders", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   userId: text("user_id")
//     .notNull()
//     .references(() => user.id, { onDelete: "cascade" }),
//   totalAmount: integer("total_amount").notNull(),
//   status: statusEnum("status").default("pending"), // or 'pending'
//   paypalOrderId: text("paypal_order_id").notNull(),
//   createdAt: timestamp("created_at").$defaultFn(() => new Date()),
// });
export async function SaveOrderToDatabaseAction({
  userId,
  paypalOrderId,
  referenceId,
}: {
  paypalOrderId: string;
  userId: string;
  referenceId: string;
}) {
  try {
    // get product
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, referenceId));

    if (!product) {
      return {
        status: false,
        message: "Product not found",
      };
    }
    // add to database
    const [order] = await db
      .insert(orders)
      .values({
        userId,
        totalAmount: product.price,
        status: "completed",
        paypalOrderId,
      })
      .returning();

    const value = await db.insert(orderItems).values({
      orderId: order.id,
      price: order.totalAmount,
      productId: product.id,
    });
    return {
      status: true,
      message: "Successfuly added to database",
    };
  } catch (error) {
    console.log(error);

    return {
      status: false,
      message: "Error occured while adding to db",
    };
  }
}
