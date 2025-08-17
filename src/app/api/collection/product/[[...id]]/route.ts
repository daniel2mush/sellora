import { GetAllUserCollectionWithProductCount } from '@/app/actions/userActions/collection'
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
