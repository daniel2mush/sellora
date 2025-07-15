"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import {
  ArrowUpDown,
  ChartBar,
  ChevronUp,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  PlusCircleIcon,
  Settings,
  ShoppingBasket,
  SquareRadical,
  User,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useSession } from "@/lib/authClient";
import { Suspense } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";

export default function AppSideBar() {
  const { state } = useSidebar();

  const { data, isPending } = useSession();

  const items = [
    {
      title: "Products",
      url: "/admin/dashboard/products",
      icon: <Package className="w-5 h-5 flex-shrink-0" />,
    },
    {
      title: "Orders",
      url: "/admin/dashboard/orders",
      icon: <ArrowUpDown className="w-5 h-5 flex-shrink-0" />,
    },
    {
      title: "Payments",
      url: "/admin/dashboard/payments",
      icon: <CreditCard className="w-5 h-5 flex-shrink-0" />,
    },
    {
      title: "Analytics",
      url: "/admin/dashboard/analytics",
      icon: <ChartBar className="w-5 h-5 flex-shrink-0" />,
    },
    {
      title: "Settings",
      url: "/admin/dashboard/settings",
      icon: <Settings className="w-5 h-5 flex-shrink-0" />,
    },
  ];

  return (
    <Sidebar collapsible="icon" className=" overflow-hidden">
      <div className=" h-full bg-primary text-secondary ">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b-2 pt-5 pb-5 pl-2 flex-shrink-0 min-h-[70px]">
          <ShoppingBasket size={30} className=" flex-shrink-0" />
          <div className="overflow-hidden transition-all duration-300">
            <h1 className="text-2xl font-black whitespace-nowrap">SELLORA</h1>
            <p className="text-muted-foreground whitespace-nowrap">
              Selling with ease
            </p>
          </div>
        </div>
        {/* Add products */}
        <div className="px-1.5 ">
          <Dialog>
            <DialogTrigger asChild>
              <div className=" flex items-center gap-5 pl-2 w-full py-2 rounded  flex-shrink-0 hover:bg-gray-800 mt-4 cursor-pointer">
                <Plus width={20} className="flex-shrink-0" />
                <h1 className=" flex-shrink-0">Add new products</h1>
              </div>
            </DialogTrigger>
            <DialogContent className="">
              <DialogHeader>
                <DialogTitle>Add a new product</DialogTitle>
              </DialogHeader>
              <AddProductForm />
              <DialogFooter>
                <DialogClose asChild>
                  <Button>Cancel</Button>
                </DialogClose>
                <Button type="submit">Add Product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {/* Dashboard */}
        <div className="px-1.5 mt-5">
          <div className=" space-y-5">
            <Link
              href={"/admin/dashboard"}
              className=" flex items-center gap-5 pl-2 w-full py-2 rounded  flex-shrink-0 hover:bg-gray-800">
              <LayoutDashboard width={20} className="flex-shrink-0" />
              <h1>Dashboard</h1>
            </Link>
            {items.map((item) => (
              <Link
                className="flex items-center gap-5 pl-2 w-full py-2 rounded  flex-shrink-0 hover:bg-gray-800"
                href={item.url}
                key={item.title}>
                {item.icon}
                <h1>{item.title}</h1>
              </Link>
            ))}
          </div>
        </div>
        {/* footer */}
        {/* <div className=" mt-15 w-full pt-15 cursor-pointer ">
          <Suspense fallback={<div>Loading</div>}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className=" w-full">
                <div className=" py-2  flex items-center border-t-2 w-full gap-3 pl-2">
                  <Avatar>
                    <AvatarFallback>{data?.user.name.charAt(0)}</AvatarFallback>
                    <AvatarImage
                      src={data?.user.image as string}
                      alt={data?.user.name}
                    />
                  </Avatar>
                  <h1 className="  font-semibold flex-shrink-0">
                    {data?.user.name}
                  </h1>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-[var(--radix-dropdown-menu-trigger-width)]">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </Suspense>
        </div> */}
      </div>
    </Sidebar>
  );
}

export function AddProductForm() {
  const form = useForm();
  return (
    <Form {...form}>
      <form></form>
    </Form>
  );
}
