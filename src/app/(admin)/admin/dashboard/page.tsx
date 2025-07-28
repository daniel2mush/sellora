import {
  getProductsActions,
  GetproductTotals,
} from "@/app/actions/productAction";
import AdminDashboard from "@/components/appCompnent/adminComponents/dashboard";
import { AdminTotalProductProps } from "@/lib/types/admin/productsTypes";

export default async function Dashboard() {
  const { res } = await GetproductTotals();

  res;
  return (
    <div>
      <AdminDashboard DashboardProps={res as AdminTotalProductProps[]} />
    </div>
  );
}
