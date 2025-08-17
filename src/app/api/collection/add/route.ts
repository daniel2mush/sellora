import { AddProductToCollection } from '@/app/actions/userActions/collection'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const data = (await request.json()) as { collectionId: string; productId: string }

  const { message } = await AddProductToCollection({
    collectionId: data.collectionId,
    productId: data.productId,
  })

  return NextResponse.json({ message })
}
