import { getProductsActions } from "@/app/actions/productAction";
import AdminProducts, {
  productTypes,
} from "@/components/appCompnent/adminComponents/productPage";

export default async function AdminProductDashboard({
  searchParams,
}: {
  searchParams: Promise<{ isPublished: string }>;
}) {
  const value = await searchParams;

  console.log((await value).isPublished, "Value");

  let searchBool: boolean | undefined = undefined;
  if (value.isPublished === "true") searchBool = true;
  if (value.isPublished === "false") searchBool = false;

  const Product = await getProductsActions(searchBool);

  return (
    <div>
      <AdminProducts products={Product as productTypes[]} />
    </div>
  );
}
