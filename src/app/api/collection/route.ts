import { CreateACollection, GetAllUserCollection } from '@/app/actions/userActions/collection'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const data = (await request.json()) as { collectionName: string }

  const { message } = await CreateACollection(data.collectionName)

  return NextResponse.json({ message })
}

export async function GET() {
  const data = await GetAllUserCollection()

  return NextResponse.json(data)
}
