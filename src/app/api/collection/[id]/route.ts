//Update

import { DeleteCollectionAction, EditCollectionAction } from '@/app/actions/userActions/collection'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = (await request.json()) as { collectionName: string }

  const { message } = await EditCollectionAction({
    collectionId: id,
    collectionName: data.collectionName,
  })

  return NextResponse.json(message)
}

//Delete
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { message } = await DeleteCollectionAction({
    collectionId: id,
  })

  return NextResponse.json(message)
}
