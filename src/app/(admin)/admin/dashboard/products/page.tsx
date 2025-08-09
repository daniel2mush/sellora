import { getProductsActions } from "@/app/actions/admin/productAction";
import AdminProducts from "@/components/appCompnent/adminComponents/adminProductPage";

export default async function AdminProductDashboard() {
  return (
    <div>
      <AdminProducts />
    </div>
  );
}
