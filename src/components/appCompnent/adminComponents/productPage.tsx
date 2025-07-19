"use client";
import {
  DeleteProductActions,
  GetAssetPublicIdAction,
  getProductsActions,
  PublishProductAction,
} from "@/app/actions/productAction";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ArrowDown,
  ChevronDown,
  Ellipsis,
  Eye,
  Filter,
  Plus,
  Search,
  SquarePen,
  Trash,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AddProductForm from "../addProducts/add-products";
import { Select, SelectItem, SelectTrigger } from "@/components/ui/select";
import { SelectContent } from "@radix-ui/react-select";
import { toast } from "sonner";
import axios from "axios";
import { getDeleteSignature, getSignature } from "@/app/actions/cloudinary";

export interface productTypes {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  isPublished: boolean | null;
  thumbnailUrl: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface AdminProductProps {
  products: productTypes[];
}

export default function AdminProducts({ products }: AdminProductProps) {
  const [query, setQuery] = useState("");

  const [open, setOpen] = useState(false);
  const [productselected, setProductSelected] = useState<productTypes | null>(
    null
  );

  const [filterValue, setFilterValue] = useState("All Products");
  const [filterOpen, setFilterOpen] = useState(false);

  let productCopy = query
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [...products];

  function handleDialog(p: productTypes) {
    setOpen(true);
    setProductSelected(p);
  }

  async function handleDelete(p: productTypes) {
    try {
      const { public_id } = await GetAssetPublicIdAction(p.id);

      console.log(public_id);

      const res = await DeleteAssetFromCloudinary(public_id as string);
      console.log(res, "Cloudinary response");

      if (res.result === "ok") {
        const { success, message } = await DeleteProductActions({
          productId: p.id,
        });

        if (success) {
          toast.success(message);
          return;
        }

        toast.error(message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function DeleteAssetFromCloudinary(public_id: string) {
    const now = new Date();
    const timestamp = Math.floor(now.getTime() / 1000);
    const { data } = await getDeleteSignature({ timestamp, public_id });

    const formData = new FormData();
    formData.append("public_id", public_id);
    formData.append("api_key", data.apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", data.signature);

    try {
      const cloudinaryRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/raw/destroy`,
        formData
      );

      return cloudinaryRes.data;
    } catch (e) {
      console.error("Unable to delete item from cloudinary", e);
      throw new Error();
    }
  }
  return (
    <div className=" space-y-5">
      <div className=" flex justify-between items-center">
        <div>
          <h1 className=" text-4xl font-bold">Products</h1>
          <p className=" text-muted-foreground">Manage your products</p>
        </div>
        <Button className=" cursor-pointer">
          <Plus /> Add a product
        </Button>
      </div>
      <div className=" flex gap-10 items-center">
        <div className=" flex items-center border shadow w-full max-w-md rounded p-2 space-x-2">
          <Search size={15} className=" text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
            className=" w-full  active:outline-0 focus:outline-0"
          />
        </div>
        <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"}>
              <Filter />
              {filterValue}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" w-[150px]">
            <DropdownMenuGroup>
              <Link
                onClick={() => {
                  setFilterValue("All Products");
                  setFilterOpen(false);
                }}
                href={`/admin/dashboard/products`}>
                <DropdownMenuItem>All products</DropdownMenuItem>
              </Link>
              <Link
                onClick={() => {
                  setFilterValue("Published");
                  setFilterOpen(false);
                }}
                href={`/admin/dashboard/products?isPublished=true`}>
                <DropdownMenuItem>Published</DropdownMenuItem>
              </Link>
              <Link
                onClick={() => {
                  setFilterValue("Draft");
                  setFilterOpen(false);
                }}
                href={`/admin/dashboard/products?isPublished=false`}>
                <DropdownMenuItem>Draft</DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {products.length <= 0 && (
        <div className=" flex justify-center">
          No products yet, please add a product
        </div>
      )}

      {/* Products */}

      <div>
        <div className=" gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  ">
          {productCopy.map((p) => (
            <div key={p.id} className=" shadow rounded-2xl overflow-hidden">
              <div className=" relative h-50  ">
                <Image
                  src={p.thumbnailUrl as string}
                  alt={p.title as string}
                  fill
                  className=" object-cover"
                />
                <div className=" absolute top-0 right-0">
                  <Badge
                    className={p.isPublished ? "bg-green-600" : "bg-amber-600"}>
                    {p.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
              {/* Product details */}
              <div className=" px-5 py-2 space-y-3 ">
                <div>
                  {/* header */}
                  <h1 className=" font-bold ">{p.title}</h1>
                  <p>{p.description}</p>
                </div>
                {/* price */}
                <div>
                  <h1 className=" font-bold text-xl ">
                    {" "}
                    ${(p.price / 100).toFixed(2)}
                  </h1>
                </div>

                {/* footer */}
                <div className="flex items-center justify-between">
                  <div className="">
                    {!p.isPublished && (
                      <Button
                        onClick={() => PublishProductAction(p.id)}
                        className=" bg-green-500">
                        Publish Now
                      </Button>
                    )}
                  </div>
                  {/* More options */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className=" cursor-pointer" variant={"ghost"}>
                        <Ellipsis size={15} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="top"
                      align="start"
                      className=" text-sm">
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <Eye />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDialog(p)}>
                          <SquarePen />
                          Edit products
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(p)}
                          className=" text-red-500">
                          <Trash className="text-red-500" />
                          Delete product
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
        {productselected && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a new product</DialogTitle>
              </DialogHeader>
              <AddProductForm
                setOpen={() => setOpen(false)}
                products={{
                  id: productselected.id,
                  title: productselected.title,
                  description: productselected.description,
                  price: productselected.price.toString(),
                  thumbnailUrl: productselected.thumbnailUrl as string,
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
