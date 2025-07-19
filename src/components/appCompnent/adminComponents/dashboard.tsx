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

export default function AdminDashboard() {
  interface DashboardOverviewOne {
    icon: React.ReactNode;
    price: string;
    title: string;
    color: string;
  }

  const dashboardOverview1: DashboardOverviewOne[] = [
    {
      title: "Total Sales",
      price: "$250.00",
      icon: <ArrowRightLeft />,
      color: "#4d8bff",
    },
    {
      title: "Total Income",
      price: "$250.00",
      icon: <Shuffle />,
      color: "#4da6ff",
    },
    {
      title: "Orders paid",
      price: "$250.00",
      icon: <ShoppingCart />,
      color: "#ffb84d",
    },
    {
      title: "Last Month",
      price: "$250.00",
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

  const ordersDashBoardView: orderDashboardView[] = [
    {
      icon: <ShoppingCart />,
      title: "Total Orders",
      value: "2220",
      color: "#ff4d4d",
    },
    {
      icon: <Download />,
      title: "Total Downloads",
      value: "2220",
      color: "#ff7f4d",
    },
    {
      icon: <Package />,
      title: "Total Products",
      value: "2220",
      color: "#ffb84d",
    },
  ];

  interface Chart {
    name: string;
    uv: number;
    pv: number;
    amt: number;
  }
  const chartData = [
    { month: "January", sales: 186, income: 80 },
    { month: "February", sales: 305, income: 200 },
    { month: "March", sales: 237, income: 120 },
    { month: "April", sales: 73, income: 190 },
    { month: "May", sales: 209, income: 130 },
    { month: "June", sales: 214, income: 140 },
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
      {/* <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ordersDashBoardView.map((order) => (
          <div
            style={{
              background: `${order.color}`,
            }}
            key={order.title}
            className="flex items-center gap-2 shadow rounded-lg border p-3  ">
            <div
              style={{
                background: `${order.color}`,
              }}
              className=" rounded-full p-3 w-15 h-15 flex items-center justify-center text-white ">
              {order.icon}
            </div>
            <div>
              <p>{order.title}</p>
              <h1>{order.value}</h1>
            </div>
          </div>
        ))}
      </div> */}
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
