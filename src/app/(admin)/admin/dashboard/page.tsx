import {
  getProductsActions,
  GetproductTotals,
} from "@/app/actions/admin/productAction";
import AdminDashboard from "@/components/appCompnent/adminComponents/dashboard";
import { AdminTotalProductProps } from "@/lib/types/admin/productsTypes";

export default async function Dashboard() {
  return (
    <div>
      <AdminDashboard />
    </div>
  );
}
