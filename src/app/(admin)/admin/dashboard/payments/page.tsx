'use client'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useGetProductTotal } from '@/lib/utils/admin/adminQueryFun'
import { motion, AnimatePresence } from 'framer-motion' // For animations
import { SkeletonRow } from '@/components/skeletonCard'

// SkeletonRow with shimmer effect

export default function Payments() {
  const { data, isLoading, error } = useGetProductTotal()
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' })
  // const isLoading = true;

  if (error) {
    return <div className="text-center text-red-500">Error loading data</div>
  }

  const reversedData = data?.res ? [...data.res].reverse() : []

  // Sorting logic
  const sortedData = [...reversedData].sort((a, b) => {
    if (sortConfig.key === 'date') {
      if (a.purchaseItems?.createdAt && b.purchaseItems?.createdAt) {
        const dateA = new Date(a.purchaseItems.createdAt)
        const dateB = new Date(b.purchaseItems.createdAt)
        return sortConfig.direction === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime()
      }
    }
    if (sortConfig.key === 'amount') {
      const amountA = a.products.price
      const amountB = b.products.price
      return sortConfig.direction === 'asc' ? amountA - amountB : amountB - amountA
    }
    return 0
  })

  const handleSort = (key: string) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-10 text-gray-800">Purchase Table</h1>
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 hover:bg-gray-200 transition-colors">
                <TableHead className="font-bold text-[16px]">Photo</TableHead>
                <TableHead className="font-bold text-[16px]">User</TableHead>
                <TableHead className="font-bold text-[16px]">Email</TableHead>
                <TableHead className="font-bold text-[16px]">Product</TableHead>
                <TableHead className="font-bold text-[16px]">Status</TableHead>
                <TableHead className="font-bold text-[16px]">Method</TableHead>
                <TableHead
                  className="font-bold text-[16px] cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  Amount
                  {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead
                  className="font-bold text-[16px] cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  Date
                  {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {isLoading
                  ? Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} index={i} />)
                  : sortedData.map(({ products, purchaseItems, user }, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`${
                          i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } hover:bg-gray-100 transition-colors`}
                      >
                        {purchaseItems && (
                          <>
                            <TableCell>
                              <Avatar>
                                <AvatarFallback className="bg-green-500 text-white font-bold">
                                  {user?.name.charAt(0)}
                                </AvatarFallback>
                                <AvatarImage src={user.image!} alt={user?.name} />
                              </Avatar>
                            </TableCell>
                            <TableCell className="font-medium text-gray-800">
                              {user?.name}
                            </TableCell>
                            <TableCell className="text-gray-600">{user?.email}</TableCell>
                            <TableCell className="text-gray-600">{products.title}</TableCell>
                            <TableCell>
                              <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 font-semibold">
                                PAID
                              </span>
                            </TableCell>
                            <TableCell className="text-gray-600">Paypal</TableCell>
                            <TableCell className="font-semibold text-[16px] text-gray-800">
                              ${(products.price / 100).toFixed(2)}
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {new Date(purchaseItems.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </TableCell>
                          </>
                        )}
                      </motion.tr>
                    ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
