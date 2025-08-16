export interface productTypes {
  id: string
  userId: string
  title: string
  description: string
  price: number
  isPublished: boolean | null
  thumbnailUrl: string | null
  createdAt: Date | null
  updatedAt: Date | null
}

export interface userTypes {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: Date
  updatedAt: Date
  role: string | null
  banned: boolean | null
  banReason: string | null
  banExpires: Date | null
}
export interface paginationData {
  currentPage: number
  totalPages: number
  total: number
  pageSize: number
}

export interface productWithUser {
  products: productTypes
  user: userTypes
}

export type InvoiceTypes = {
  seller: {
    name: string
    email: string
  }
  buyer: {
    name: string
    email: string
  }
  purchase: {
    id: string
    userId: string
    totalAmount: number
    status: string
    paypalOrderId: string
    createdAt: Date
    updatedAt: Date
  }
  product: {
    name: string
    price: number
  }
  invoices: {
    id: string
    purchaseId: string
    buyerId: string
    sellerId: string
    invoiceNumber: string
    issueDate: Date
    subtotal: number
    tax: number
    total: number
    currency: string
    status: string
    createdAt: Date
    updatedAt: Date
  }
}

export interface productWithAsset {
  products: productTypes
  assets: { productId: string }
}

export interface userProfileTypes {
  userInfo: userTypes
  product: productWithAsset[]
}
