import { UnLikeProductAction } from '@/app/actions/userActions/ProductActionsUser'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const product = (await request.json()) as { productId: string }

  if (!product)
    return NextResponse.json({
      status: false,
      message: 'Please provide a product Id',
    })

  await UnLikeProductAction(product.productId)

  return NextResponse.json({
    status: true,
    message: 'message Unliked successfully',
  })
}
