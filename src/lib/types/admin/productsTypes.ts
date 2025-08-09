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

export interface userTypes {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
}

export interface AdminTotalProductProps {
  products: productProps;
  purchaseItems: purchaseItemsProps | null;
  user: userTypes;
}

export interface ProductsWithUserAdminProps {
  products: productProps[];
  user: userTypes;
}

// export interface AllAdminTotalProductProps  {
//   res : AdminTotalProductProps
// }
