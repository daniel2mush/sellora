import {
  GetLikedProductAction,
  LikeProductAction,
} from '@/app/actions/userActions/ProductActionsUser'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const product = (await request.json()) as { productId: string }

  if (!product)
    return NextResponse.json({
      status: false,
      message: 'Please provide a product Id',
    })

  await LikeProductAction(product.productId)

  return NextResponse.json({
    status: true,
    message: 'message liked successfully',
  })
}

export async function GET() {
  const data = await GetLikedProductAction()

  return NextResponse.json(data)
}
