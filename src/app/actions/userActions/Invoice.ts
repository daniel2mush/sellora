'use server'

import { db } from '@/lib/db'
import { invoices, products, purchase, purchaseItems, user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

export async function GetInvoiceAction(purchaseId: string) {
  try {
    if (!purchaseId) {
      return {
        status: false,
        message: 'No purchase id ',
      }
    }

    const buyer = alias(user, 'buyer')
    const seller = alias(user, 'seller')

    const [results] = await db
      .select({
        seller: {
          name: seller.name,
          email: seller.email,
        },
        buyer: {
          name: buyer.name,
          email: buyer.email,
        },
        purchase,
        product: {
          name: products.title,
          price: products.price,
        },
        invoices,
      })
      .from(invoices)
      .leftJoin(buyer, eq(buyer.id, invoices.buyerId))
      .leftJoin(seller, eq(seller.id, invoices.sellerId))
      .leftJoin(purchase, eq(purchase.id, invoices.purchaseId))
      .leftJoin(purchaseItems, eq(purchaseItems.purchaseId, purchase.id))
      .leftJoin(products, eq(products.id, purchaseItems.productId))
      .where(eq(invoices.purchaseId, purchaseId))

    return results
  } catch (error) {
    console.log(error)

    return {
      status: false,
      message: 'Error occured while fetching invoice',
    }
  }
}
