import { redirect } from 'next/navigation'

export const handlePageChange = (newPage: number, searchParams: string) => {
  const currentParams = new URLSearchParams(searchParams)
  currentParams.set('page', newPage.toString())
  redirect(`?${currentParams.toString()}`)
}

export const getPageNumbers = ({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) => {
  const pages: (number | 'ellipsis')[] = []
  const startPage = Math.max(2, currentPage - 2)
  const endPage = Math.min(totalPages - 1, currentPage + 2)

  pages.push(1)
  if (startPage > 2) pages.push('ellipsis')
  for (let i = startPage; i <= endPage; i++) pages.push(i)
  if (endPage < totalPages - 1) pages.push('ellipsis')
  if (totalPages > 1) pages.push(totalPages)

  return pages
}
