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
  const { content, query, page, license } = await searchParams;
  let category: searchQueryProps | undefined = undefined;

  const ValidLicense: Record<string, LicenseType> = {
    freelicense: "free license",
    prolicense: "pro license",
  };

  // Safely map license value
  const licenseValue = license
    ? ValidLicense[license.toLowerCase().replace(/\s+|\+/g, "")] || undefined
    : undefined;

  const validFilters: Record<string, string> = {
    photos: "photo",
    pngs: "png",
    psds: "psd",
    svgs: "svg",
    vectors: "vector",
    templates: "template",
  };

  // Safely map category
  if (content) {
    category = validFilters[content.toLowerCase().replace(/\s+|\+/g, "")] as
      | searchQueryProps
      | undefined;
  }

  console.log({ content, category, license, licenseValue }); // Debugging

  const pageNumber = Math.max(1, parseInt(page || "1", 10)); // Ensure pageNumber is at least 1
  const pageSize = 12;

  const {
    products,
    total,
    page: currentPage,
    totalPages,
  } = await GetAllProductsActions(
    category, // Pass category as searchQuery
    query, // Pass query as query
    pageNumber,
    pageSize,
    licenseValue // Pass licenseValue as license
  );

  return (
    <SidebarWrapper>
      <ProductPage
        products={(products as productWithUser[]) || []}
        pagination={{
          currentPage,
          totalPages,
          total,
          pageSize,
        }}
      />
    </SidebarWrapper>
  );
}
