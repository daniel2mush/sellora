import axios from "axios";

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
