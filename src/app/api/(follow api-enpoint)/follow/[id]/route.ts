import {
  FollowAdminAction,
  IsFollowing,
  UnFollowAdminAction,
} from '@/app/actions/userActions/follow'
import { NextRequest, NextResponse } from 'next/server'

// follow admin
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { status, message } = await FollowAdminAction(id.toString())

  if (status) {
    return NextResponse.json(message)
  }

  throw new Error('Error occured, please try again')
}

// Unfollow Admin
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { status, message } = await UnFollowAdminAction(id.toString())

  if (status) {
    return NextResponse.json({ message: message })
  }

  throw new Error('Error occured, please try again')
}

// checker

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const res = await IsFollowing(id.toString())

  return NextResponse.json(res as boolean)
}
