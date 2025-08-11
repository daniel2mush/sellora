import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import axios from 'axios'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { env } from '../../../../env'
import { invoices, products, purchase, purchaseItems } from '@/lib/db/schema'

export async function CreatePaypalOrder(productId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) redirect('/auth')

  try {
    // 1. Check if product exists
    const [product] = await db.select().from(products).where(eq(products.id, productId))

    if (!product) {
      return {
        status: false,
        message: 'No product found with this ID',
      }
    }

    // 2. Check if already purchased
    const alreadyBought = await db
      .select()
      .from(purchaseItems)
      .innerJoin(purchase, eq(purchaseItems.purchaseId, purchase.id))
      .where(and(eq(purchase.userId, session.user.id), eq(purchaseItems.productId, productId)))
      .limit(1)

    if (alreadyBought.length > 0) {
      return {
        status: false,
        message: 'Item is already purchased',
      }
    }

    // 3. Create PayPal order
    const res = await axios.post(
      `${env.PAYPAL_ENDPOINT}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: product.id,
            description: `Purchase of ${product.title}`,
            amount: {
              currency_code: 'USD',
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
          ).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      }
    )

    // 4. Extract approval URL
    const approvalUrl = res.data.links.find((link: { rel: string }) => link.rel === 'approve')?.href

    return {
      status: true,
      approvalUrl,
      orderId: res.data.id,
    }
  } catch (error) {
    console.error(error)
    return {
      status: false,
      message: 'Something went wrong while creating the PayPal order.',
    }
  }
}

// });
export async function SaveOrderToDatabaseAction({
  userId,
  paypalOrderId,
  referenceId,
}: {
  paypalOrderId: string
  userId: string
  referenceId: string
}) {
  try {
    // get product
    const [product] = await db.select().from(products).where(eq(products.id, referenceId))

    if (!product) {
      return {
        status: false,
        message: 'Product not found',
      }
    }
    // add to database
    const [purchaseValue] = await db
      .insert(purchase)
      .values({
        userId,
        totalAmount: product.price,
        status: 'completed',
        paypalOrderId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    //  Add to invoice table
    const now = new Date()
    const taxRate = 0.1
    const subtotal = purchaseValue.totalAmount // already in cents
    const tax = Math.round(subtotal * taxRate) // still in cents
    const total = subtotal + tax

    const invoiceNumber = `INV-${new Date().getFullYear()}${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`

    await db.insert(invoices).values({
      buyerId: userId,
      sellerId: product.userId,
      purchaseId: purchaseValue.id,
      subtotal,
      tax,
      total,
      currency: 'USD',
      status: 'paid',
      invoiceNumber,
      issueDate: now,
      createdAt: now,
      updatedAt: now,
    })

    await db.insert(purchaseItems).values({
      purchaseId: purchaseValue.id,
      price: purchaseValue.totalAmount,
      productId: product.id,
      updatedAt: now,
    })
    return {
      status: true,
      message: 'Successfuly added to database',
    }
  } catch (error) {
    console.log(error)

    return {
      status: false,
      message: 'Error occured while adding to db',
    }
  }
}
