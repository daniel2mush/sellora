"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AdminTotalProductProps } from "@/lib/types/admin/productsTypes";
import {
  ArrowRightLeft,
  CreditCard,
  Download,
  Package,
  RefreshCcw,
  ShoppingBag,
  ShoppingCart,
  Shuffle,
  Truck,
} from "lucide-react";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminDashboard({
  DashboardProps,
}: {
  DashboardProps: AdminTotalProductProps[];
}) {
  interface DashboardOverviewOne {
    icon: React.ReactNode;
    price: string;
    title: string;
    color: string;
  }

  // Last month
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 0);
  const LastMonth = DashboardProps.filter((o) => {
    if (o.purchaseItems !== undefined) {
      const d = new Date(o.purchaseItems?.createdAt as Date);
      const value = d >= start && d <= end;

      return value;
    }
  }).reduce((sum, o) => sum + (o.purchaseItems?.price! ?? 0), 0);

  // Total price
  let TotalPrice = DashboardProps.reduce(
    (sum, o) => sum + (o.purchaseItems?.price ?? 0),
    0
  );
  let TotalIncome = DashboardProps.reduce(
    (sum, o) => sum + o.products.price,
    0
  );

  const dashboardOverview1: DashboardOverviewOne[] = [
    {
      title: "Total Sales",
      price: `$${(TotalPrice / 100).toFixed(2)}`,
      icon: <ArrowRightLeft />,
      color: "#4d8bff",
    },
    {
      title: "Total Income",
      price: `$${(TotalIncome / 100).toFixed(2)}`,
      icon: <Shuffle />,
      color: "#4da6ff",
    },

    {
      title: "Last Month",
      price: `$${(LastMonth / 100).toFixed(2)}`,
      icon: <CreditCard />,
      color: "#ff7f4d",
    },
  ];

  interface orderDashboardView {
    icon: React.ReactNode;
    title: string;
    value: string;
    color: string;
  }

  interface Chart {
    name: string;
    uv: number;
    pv: number;
    amt: number;
  }
  const chartData = [
    { month: "January", sales: 20 },
    { month: "February", sales: 50 },
    { month: "March", sales: 10 },
    { month: "April", sales: 100 },
    { month: "May", sales: 0 },
    // { month: "February", sales: 305, income: 200 },
    // { month: "March", sales: 237, income: 120 },
    // { month: "April", sales: 73, income: 190 },
    // { month: "May", sales: 209, income: 130 },
    // { month: "June", sales: 214, income: 140 },
  ];

  const chartConfig = {
    sales: {
      label: "Sales",
      color: "#2563eb",
    },
    income: {
      label: "Income",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  return (
    <div className=" space-y-5">
      <div>
        <h1 className=" text-2xl font-bold  ">Dashboard overview</h1>
        <p>Here is what is going on with your business</p>
      </div>
      {/* Dasboard overview  */}
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardOverview1.map((d) => (
          <Card key={d.title}>
            <CardContent>
              <div className=" flex flex-col items-center gap-2">
                <div
                  style={{
                    background: `${d.color}`,
                  }}
                  className=" rounded-full w-10 h-10 p-2 text-white flex items-center justify-center">
                  {d.icon}
                </div>
                <h1 className=" font-medium ">{d.title}</h1>
                <h1 className=" text-2xl font-bold">{d.price}</h1>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className=" text-2xl font-bold">Income vs Sales</CardTitle>
          <CardDescription>
            Monthly comparison of Sales and Income
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
                left: 12,
                right: 12,
                bottom: 12,
              }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                dataKey="sales"
                type="monotone"
                stroke="var(--color-sales)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-sales)",
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                }}
              />
              <Line
                dataKey="income"
                type="monotone"
                stroke="var(--color-income)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-income)",
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
