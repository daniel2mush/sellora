// app/api/admin/recent-purchases/route.ts
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { purchase, purchaseItems, products, user } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const recent = await db
      .select({
        productTitle: products.title,
        buyerName: user.name,
        purchaseDate: purchase.createdAt,
        price: purchaseItems.price,
      })
      .from(purchaseItems)
      .leftJoin(products, eq(purchaseItems.productId, products.id))
      .leftJoin(purchase, eq(purchaseItems.purchaseId, purchase.id))
      .leftJoin(user, eq(purchase.userId, user.id))
      .where(eq(products.userId, session.user.id))
      .orderBy(desc(purchase.createdAt))
      .limit(5)

    return NextResponse.json({ success: true, data: recent })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch recent purchases' },
      { status: 500 }
    )
  }
}
