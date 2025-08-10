import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { productWithUser } from "../types/productTypes";

export async function fetchAllProducts(searchParams: string) {
  try {
    const res = await axios.get(`/api/products?${searchParams}`);

    if (res.status === 200) {
      return res.data;
    }

    throw new Error("Error occured while fetching products");
  } catch (error) {
    console.log(error);
    throw new Error("Error occured while fetching products, please try again ");
  }
}

export function useGetSingleProduct(productId: string) {
  return useQuery<productWithUser>({
    queryKey: ["single-product", productId],
    queryFn: async () => {
      const res = await axios.get(`/api/products/${productId}`);

      if (res.status === 200) {
        return res.data.data;
      }
    },
  });
}
