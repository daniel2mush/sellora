import { searchQueryProps } from '@/app/actions/userActions/ProductActionsUser'
import { GetUserInformation } from '@/app/actions/userActions/userActions'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>; searchParams: searchQueryProps }
) {
  const paramsValue = await params
  const searchParams = request.nextUrl.searchParams

  const searchvalue = searchParams.get('content')

  let value = ''

  if (searchvalue === 'all') {
    value = ''
  } else {
    value = searchvalue as string
  }

  if (!paramsValue.id) return NextResponse.json({ success: false, message: 'No id provided' })
  console.log(searchParams, 'Search parama')

  const data = await GetUserInformation(paramsValue.id, value as searchQueryProps)

  // console.log(data.user?.userInfo, 'User info')

  return NextResponse.json(data.user)
}
