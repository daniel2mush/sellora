import {
  GetAllUserCollectionWithProductCount,
  RemoveFromCollection,
} from '@/app/actions/userActions/collection'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const value = await params
  let id = undefined

  if (value && value.id !== undefined) {
    id = value.id.toString()
  }

  const res = await GetAllUserCollectionWithProductCount(id)

  return NextResponse.json(res)
}

// Delete product from a collection
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const searchParams = request.nextUrl.searchParams

  const productId = searchParams.get('productId')
  const { id } = await params
  console.log(productId, 'Product ID')
  console.log(id, 'Collection ID')

  const { message } = await RemoveFromCollection({
    collectionId: id.toString(),
    productId: productId!,
  })

  return NextResponse.json(message)
}
