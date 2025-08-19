import { GetAdminFollowers } from '@/app/actions/userActions/follow'
import { NextRequest, NextResponse } from 'next/server'

// Get admin followers
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const data = await GetAdminFollowers(id.toString())

  return NextResponse.json(data)
}
