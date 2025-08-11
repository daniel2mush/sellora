'use client'

import { Sidebar } from '../../ui/sidebar'
import { CreditCard, LayoutDashboard, Package, Plus, ShoppingBasket } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog'
import AddProductForm from './add-products'

export default function AdminSideBar() {
  const [open, setOpen] = useState(false)

  const items = [
    {
      title: 'Products',
      url: '/admin/dashboard/products',
      icon: <Package className="w-5 h-5 flex-shrink-0" />,
    },

    {
      title: 'Payments',
      url: '/admin/dashboard/payments',
      icon: <CreditCard className="w-5 h-5 flex-shrink-0" />,
    },
  ]

  return (
    <Sidebar collapsible="icon" className="overflow-hidden">
      <div className="h-full bg-primary text-secondary">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b-2 pt-5 pb-5 pl-2 flex-shrink-0 min-h-[70px]">
          <ShoppingBasket size={30} className="flex-shrink-0" />
          <div className="overflow-hidden transition-all duration-300">
            <h1 className="text-2xl font-black whitespace-nowrap">SELLORA</h1>
            <p className="text-muted-foreground whitespace-nowrap">Selling with ease</p>
          </div>
        </div>

        {/* Add Product */}
        <div className="px-1.5">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <div className="flex items-center gap-5 pl-2 w-full py-2 rounded hover:bg-gray-800 mt-4 cursor-pointer">
                <Plus width={20} className="flex-shrink-0" />
                <h1 className="flex-shrink-0">Add new products</h1>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a new product</DialogTitle>
              </DialogHeader>
              <AddProductForm setOpen={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Navigation */}
        <div className="px-1.5 mt-5">
          <div className="space-y-5">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-5 pl-2 w-full py-2 rounded hover:bg-gray-800"
            >
              <LayoutDashboard width={20} className="flex-shrink-0" />
              <h1>Dashboard</h1>
            </Link>
            {items.map((item) => (
              <Link
                className="flex items-center gap-5 pl-2 w-full py-2 rounded hover:bg-gray-800"
                href={item.url}
                key={item.title}
              >
                {item.icon}
                <h1>{item.title}</h1>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Sidebar>
  )
}
