interface productProps {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  price: number;
  isPublished: boolean | null;
  thumbnailUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface purchaseItemsProps {
  id: string;
  purchaseId: string;
  productId: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminTotalProductProps {
  products: productProps;
  purchaseItems: purchaseItemsProps | null;
}

// export interface AllAdminTotalProductProps  {
//   res : AdminTotalProductProps
// }
