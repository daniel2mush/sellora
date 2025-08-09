import { ReactNode } from "react";

export type Stat = {
  sales: number;
  income: number;
  newCustomers: number;
  totalProducts: number;
};

export type SalesAnalyticsItem = {
  month: string;
  totalSales: number;
  totalIncome: number;
};

export type TopProduct = {
  title: string;
  sales: number;
};

export type RecentPurchase = {
  productTitle: string;
  buyerName: string;
  purchaseDate: string;
  price: number;
};

export type CardProps = {
  children: ReactNode;
  className?: string;
};
