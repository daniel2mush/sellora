import {
  ProductPage,
  productTypes,
} from "@/components/appCompnent/userComponent/products/productPage";
import { GetAllProductsActions } from "../actions/userActions/get-all-product-actions";

export default async function Products() {
  const products = await GetAllProductsActions();

  return (
    <div>
      <ProductPage products={(products as productTypes[]) || []} />
    </div>
  );
}
