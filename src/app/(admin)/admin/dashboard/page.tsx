import { getProductsActions } from "@/app/actions/productAction";
import AdminDashboard from "@/components/appCompnent/adminComponents/dashboard";

export default async function Dashboard() {
  // const { orderValue } = await getProductsActions();

  // console.log(orderValue, "Products");

  return (
    <div>
      <AdminDashboard />
    </div>
  );
}
