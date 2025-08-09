"use client";

import {
  RecentPurchase,
  SalesAnalyticsItem,
  Stat,
  TopProduct,
} from "@/lib/types/admin/dashboardTypes";
import { AdminTotalProductProps } from "@/lib/types/admin/productsTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export async function GetAdminProducts(searchQuery: string) {
  try {
    const res = await axios.get(`/api/admin/products?${searchQuery}`);

    if (res.status === 200) {
      return res.data;
    }

    throw new Error("Error occured while getting product");
  } catch (error) {
    console.log(error);
    throw new Error("Error occured, please try again later");
  }
}

export function useAddAdminProducts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.post("/api/admin/products", formData);

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    },
  });
}

export function useUpdateIsPublish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.put("/api/admin/products/publish", { id });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await axios.delete(`/api/admin/products/${productId}`);
      return res.data as { status: boolean; message: string };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      ...body
    }: {
      productId: string;
      [key: string]: any;
    }) => {
      const res = await axios.put(`/api/admin/products/${productId}`, body);
      return res.data as { success: boolean; message: string };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useGetProductTotal() {
  return useQuery({
    queryKey: ["product-totals"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/product-totals");

      return res.data as { success: boolean; res: AdminTotalProductProps[] };
    },
    refetchOnWindowFocus: true, // 🔄 Refetch when tab/window is focused
    refetchOnReconnect: true, // 🔄 Refetch on network reconnect
    refetchInterval: 5000, // 🔁 Refetch every 5 seconds (optional)
    staleTime: 0,
  });
}

// ------------ Dashboard ----------
export function useExtraMetrics(range: any) {
  return useQuery<Stat, Error>({
    queryKey: ["extra-metrics", range.from, range.to],
    queryFn: async () => {
      const res = await axios.get("/api/admin/extra-metrics", {
        params: { from: range.from.toISOString(), to: range.to.toISOString() },
      });
      if (!res.data?.data) throw new Error("Invalid stats response");
      return res.data.data;
    },
  });
}

export function useSaleAnalytics(range: any) {
  return useQuery<SalesAnalyticsItem[], Error>({
    queryKey: ["sales-analytics", range.from, range.to],
    queryFn: async () => {
      const res = await axios.get("/api/admin/analytic", {
        params: { from: range.from.toISOString(), to: range.to.toISOString() },
      });
      if (!res.data?.data) throw new Error("Invalid sales analytics response");
      return res.data.data;
    },
  });
}

export function useTopProducts(range: any) {
  return useQuery<TopProduct[], Error>({
    queryKey: ["top-products"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/top-products");
      if (!res.data?.data) throw new Error("Invalid top products response");
      return res.data.data;
    },
  });
}
export function useRecentPurchase() {
  return useQuery<RecentPurchase[], Error>({
    queryKey: ["recent-purchases"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/recent-purchase");
      if (!res.data?.data) throw new Error("Invalid recent purchases response");
      return res.data.data;
    },
  });
}
