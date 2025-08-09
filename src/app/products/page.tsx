import SidebarWrapper from "@/components/appCompnent/userComponent/products/sidebar/SidebarWrapper";
import { ProductPage } from "@/components/appCompnent/userComponent/products/productPage";
import {
  GetAllProductsActions,
  LicenseType,
  searchQueryProps,
} from "../actions/userActions/ProductActionsUser";
import { productWithUser } from "@/lib/types/productTypes";

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{
    content?: string;
    query?: string;
    page?: string;
    license?: string;
  }>;
}) {
  return (
    <SidebarWrapper>
      <ProductPage />
    </SidebarWrapper>
  );
}
