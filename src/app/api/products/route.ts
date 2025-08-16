import {
  GetAllProductsActions,
  searchQueryProps,
} from '@/app/actions/userActions/ProductActionsUser'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const content = searchParams.get('content')
  const query = searchParams.get('query') || undefined
  const page = searchParams.get('page')

  try {
    let category: searchQueryProps | undefined

    if (content === 'all') {
      category = undefined
    } else {
      category = content as searchQueryProps
    }

    const pageNumber = Number(page) || 1
    const pageSize = 12

    const {
      products,
      total,
      page: currentPage,
      totalPages,
    } = await GetAllProductsActions(category, query, pageNumber, pageSize)

    return NextResponse.json({
      status: 200,
      products,
      paginationData: { currentPage, totalPages, pageSize, total },
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { status: false, message: 'Error occured, please try again' },
      { status: 500 }
    )
  }
}
