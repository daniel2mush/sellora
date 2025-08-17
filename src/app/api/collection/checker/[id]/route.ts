import { CollectionItemsChecker } from '@/app/actions/userActions/collection'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const value = await params

  console.log(value.id, 'PRoduct id ')

  const data = await CollectionItemsChecker(value.id)

  return NextResponse.json(data)
}
