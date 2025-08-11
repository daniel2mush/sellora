"use client";

import { useState, useMemo, ChangeEvent, FC } from "react";

import {
  CalendarDays,
  ChartNoAxesColumn,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Default styles (will override with Tailwind)

import {
  CardProps,
  Stat,
  SalesAnalyticsItem,
  TopProduct,
  RecentPurchase,
} from "@/lib/types/admin/dashboardTypes";
import { getPresetRange } from "@/lib/utils/admin/dashboardFun";
import { Card, CardContent } from "@/components/ui/card";
import {
  useExtraMetrics,
  useRecentPurchase,
  useSaleAnalytics,
  useTopProducts,
} from "@/lib/utils/admin/adminQueryFun";

type CustomDatePickerProps = {
  selected: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
};

export const CustomDatePicker: FC<CustomDatePickerProps> = ({
  selected,
  onChange,
  minDate,
  maxDate,
  disabled,
}) => {
  return (
    <div className="relative w-full">
      <DatePicker
        selected={selected}
        onChange={(date: Date | null) => date && onChange(date)}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        dateFormat="yyyy-MM-dd"
        className="w-full pr-10 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        popperClassName="z-50"
        calendarClassName="border border-gray-200 rounded-lg shadow-lg bg-white font-sans"
        dayClassName={() =>
          "text-gray-800 hover:bg-blue-100 cursor-pointer p-1 rounded"
        }
        renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
          <div className="flex justify-between items-center px-2 py-1 bg-gray-100 rounded-t-lg">
            <button
              onClick={decreaseMonth}
              className="text-gray-600 hover:text-blue-500">
              &lt;
            </button>
            <span className="text-sm font-semibold text-gray-800">
              {date.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              onClick={increaseMonth}
              className="text-gray-600 hover:text-blue-500">
              &gt;
            </button>
          </div>
        )}
      />
      <CalendarDays
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        size={18}
      />
    </div>
  );
};

export default function SellerDashboard() {
  const [range, setRange] = useState(() => getPresetRange("thisMonth"));

  // React Query calls
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useExtraMetrics(range);

  const {
    data: salesAnalytics = [],
    isLoading: salesLoading,
    isError: salesError,
  } = useSaleAnalytics(range);

  const {
    data: topProducts = [],
    isLoading: topLoading,
    isError: topError,
  } = useTopProducts(range);

  const {
    data: recentPurchases = [],
    isLoading: recentLoading,
    isError: recentError,
  } = useRecentPurchase();

  const handlePresetChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRange(getPresetRange(e.target.value));
  };

  const handleFromDateChange = (date: Date) => {
    if (date <= new Date()) {
      setRange((r) => ({ ...r, from: date }));
    }
  };

  const handleToDateChange = (date: Date) => {
    if (date >= range.from && date <= new Date()) {
      setRange((r) => ({ ...r, to: date }));
    }
  };

  // Combine loading and error states
  const loading = statsLoading || salesLoading || topLoading || recentLoading;
  const error =
    statsError || salesError || topError || recentError
      ? "Failed to fetch dashboard data"
      : null;

  // Prepare chart data
  const chartData = useMemo(() => {
    return salesAnalytics.map((item) => ({
      name: item.month,
      Income: item.totalIncome / 100,
      Sales: item.totalSales,
    }));
  }, [salesAnalytics]);

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold text-xl">Error</h2>
          <p className="text-red-600 mt-2">{error}</p>
          <button
            onClick={() => refetchStats()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const salesValue = salesAnalytics.find((e) => e);

  return (
    <div className="p-6 bg-gray-100 min-h-screen max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Seller Analytics
      </h1>

      {/* Range selectors */}
      <div className="flex flex-wrap items-end gap-6 mb-6 bg-white p-6 rounded-xl shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <CalendarDays className="inline-block mr-2" size={16} />
            Quick Range
          </label>
          <select
            onChange={handlePresetChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={loading}
            value={(() => {
              const presets = ["thisMonth", "lastMonth", "last7", "today"];
              for (const p of presets) {
                const pr = getPresetRange(p);
                if (
                  pr.from.getTime() === range.from.getTime() &&
                  pr.to.getTime() === range.to.getTime()
                )
                  return p;
              }
              return "thisMonth";
            })()}>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="last7">Last 7 Days</option>
            <option value="today">Today</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From:
          </label>
          <CustomDatePicker
            selected={range.from}
            onChange={handleFromDateChange}
            maxDate={new Date()}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To:
          </label>
          <CustomDatePicker
            selected={range.to}
            onChange={handleToDateChange}
            minDate={range.from}
            maxDate={new Date()}
            disabled={loading}
          />
        </div>
      </div>

      {loading && (
        <div className="text-center p-8 text-gray-600 text-lg">
          Loading dashboard data...
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="p-6 bg-blue-600 text-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <p className="text-sm font-medium">Total Sales</p>
            <p className="text-2xl font-bold flex justify-between items-center mt-2">
              {salesValue ? salesValue.totalSales : "0"}
              <ShoppingCart size={24} />
            </p>
          </CardContent>
        </Card>

        <Card className="p-6 bg-green-600 text-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <p className="text-sm font-medium">Total Income</p>
            <p className="text-2xl font-bold flex items-center justify-between mt-2">
              ${salesValue ? (salesValue.totalIncome / 100).toFixed(2) : "0.00"}
              <DollarSign size={24} />
            </p>
          </CardContent>
        </Card>

        <Card className="p-6 bg-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <p className="text-sm font-medium">New Customers</p>
            <p className="text-2xl font-bold flex justify-between items-center mt-2">
              {stats?.newCustomers ?? 0}
              <Users size={24} />
            </p>
          </CardContent>
        </Card>

        <Card className="p-6 bg-pink-600 text-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <p className="text-sm font-medium">Your Products</p>
            <p className="text-2xl font-bold flex justify-between items-center mt-2">
              {stats?.totalProducts ?? 0}
              <Package size={24} />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart: Income vs Sales */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <ChartNoAxesColumn
            size={24}
            className="inline-block mr-2 space-x-4"
          />
          Income vs Sales{" "}
          <span className=" text-sm text-muted-foreground ml-3 ">
            {range.from.toLocaleDateString()} to {range.to.toLocaleDateString()}
          </span>
        </h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#2563eb"
                fontSize={12}
                label={{
                  value: "Income ($)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#10b981"
                fontSize={12}
                label={{
                  value: "Sales (units)",
                  angle: 90,
                  position: "insideRight",
                  offset: 10,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "4px",
                }}
              />
              <Legend />
              <Bar
                dataKey="Income"
                fill="#2563eb"
                yAxisId="left"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Sales"
                fill="#10b981"
                yAxisId="right"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-gray-500 py-20">
            {loading ? "Loading chart..." : "No data for selected range."}
          </div>
        )}
      </div>

      {/* Top Products table */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Top Products
        </h2>
        {topProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-sm font-semibold text-gray-700">
                    Product
                  </th>
                  <th className="p-3 text-sm font-semibold text-gray-700">
                    Sales
                  </th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map(({ title, sales }, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-sm text-gray-600">{title}</td>
                    <td className="p-3 text-sm text-gray-600">{sales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No products sold yet.</p>
        )}
      </div>

      {/* Recent Purchases table */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Recent Purchases
        </h2>
        {recentPurchases.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-sm font-semibold text-gray-700">
                    Product
                  </th>
                  <th className="p-3 text-sm font-semibold text-gray-700">
                    Buyer
                  </th>
                  <th className="p-3 text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="p-3 text-sm font-semibold text-gray-700">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentPurchases.map(
                  ({ productTitle, buyerName, purchaseDate, price }, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="p-3 text-sm text-gray-600">
                        {productTitle}
                      </td>
                      <td className="p-3 text-sm text-gray-600">{buyerName}</td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(purchaseDate).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        ${(price / 100).toFixed(2)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No recent purchases found.</p>
        )}
      </div>
    </div>
  );
}
