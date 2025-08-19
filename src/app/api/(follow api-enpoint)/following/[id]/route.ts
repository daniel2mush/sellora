import { GetUserFollowing } from '@/app/actions/userActions/follow'
import { NextRequest, NextResponse } from 'next/server'

// Get admin followers
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const data = await GetUserFollowing(id.toString())

  if (status) {
    return NextResponse.json(data)
  }

  throw new Error('Error occured, please try again')
}
