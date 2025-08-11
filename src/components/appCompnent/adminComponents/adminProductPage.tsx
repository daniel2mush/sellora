"use client";

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
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

import AddProductForm from "./add-products";

import {
  GetAdminProducts,
  useDelete,
  useUpdateIsPublish,
} from "@/lib/utils/admin/adminQueryFun";
import { GetAssetPublicIdAction } from "@/app/actions/admin/productAction";
import { HasPurchasedHistory } from "@/app/actions/userActions/ProductActionsUser";
import { getDeleteSignature } from "@/app/actions/cloudinary/cloudinary";

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
  status: boolean;
  products: productTypes[];
}

// Skeleton Card Component for Loading State
function SkeletonCard() {
  return (
    <div className="rounded-xl border shadow-sm overflow-hidden">
      <div className="relative h-48 bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [productSelected, setProductSelected] = useState<productTypes | null>(
    null
  );
  const [filterValue, setFilterValue] = useState("All Products");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<productTypes | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const { data, isLoading } = useQuery<AdminProductProps>({
    queryKey: ["adminProducts", searchString],
    queryFn: () => GetAdminProducts(searchString),
  });

  const { mutate, isPending } = useUpdateIsPublish();
  const { mutateAsync: deleteFun } = useDelete();

  const products = data?.products || [];

  const filteredProducts = query
    ? products.filter((p) =>
        `${p.title} ${p.description}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : [...products];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "title_asc") return a.title.localeCompare(b.title);
    if (sortBy === "title_desc") return b.title.localeCompare(a.title);
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "createdAt_desc")
      return (
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      );
    if (sortBy === "createdAt_asc")
      return (
        new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
      );
    return 0;
  });

  const handleDialog = (p: productTypes) => {
    setProductSelected(p);
    setOpen(true);
  };

  const handlePublish = (id: string) => {
    mutate(id);
  };

  const handleDelete = async (p: productTypes) => {
    setIsDeleting(true);
    const purchaseHistory = await HasPurchasedHistory(p.id);
    if (purchaseHistory) {
      toast.error("Product has purchase history and cannot be deleted.");
      setIsDeleting(false);
      return;
    }

    try {
      const { public_id } = await GetAssetPublicIdAction(p.id);
      await DeleteAssetFromCloudinary(public_id as string);
      const deleteResponse = await deleteFun(p.id);
      if (deleteResponse?.status) toast.success(deleteResponse.message);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product.");
    } finally {
      setIsDeleting(false);
    }
  };

  async function DeleteAssetFromCloudinary(public_id: string) {
    const timestamp = Math.floor(Date.now() / 1000);
    const { data } = await getDeleteSignature({ timestamp, public_id });

    const formData = new FormData();
    formData.append("public_id", public_id);
    formData.append("api_key", data.apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", data.signature);

    const cloudinaryRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/raw/destroy`,
      formData
    );
    return cloudinaryRes.data;
  }

  const sortOptions = [
    { label: "Title A-Z", value: "title_asc" },
    { label: "Title Z-A", value: "title_desc" },
    { label: "Price Low to High", value: "price_asc" },
    { label: "Price High to Low", value: "price_desc" },
    { label: "Newest First", value: "createdAt_desc" },
    { label: "Oldest First", value: "createdAt_asc" },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* { via the SkeletonCard component"> */}
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your products</p>
        </div>
        <Dialog open={productOpen} onOpenChange={setProductOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new product</DialogTitle>
            </DialogHeader>
            <AddProductForm setOpen={() => setProductOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search, Filter & Sort */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center border rounded-lg px-3 py-2 w-full max-w-md bg-white shadow-sm">
          <Search size={16} className="mr-2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full outline-none"
          />
        </div>
        <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2 items-center">
              <Filter size={16} />
              {filterValue}
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/dashboard/products"
                  onClick={() => setFilterValue("All Products")}>
                  All Products
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/dashboard/products?isPublished=true"
                  onClick={() => setFilterValue("Published")}>
                  Published
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/dashboard/products?isPublished=false"
                  onClick={() => setFilterValue("Draft")}>
                  Draft
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2 items-center">
              <ArrowDown size={16} />
              Sort by
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setSortBy(option.value)}>
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Product Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No products found. Try adding one.
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border shadow-sm overflow-hidden transition-transform duration-300 hover:scale-105">
              <div className="relative h-48">
                <Image
                  src={p.thumbnailUrl as string}
                  alt={p.title}
                  fill
                  className="object-cover"
                />
                <Badge
                  className={`absolute top-2 right-2 ${
                    p.isPublished ? "bg-green-600" : "bg-yellow-600"
                  }`}>
                  {p.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
              <div className="p-4 space-y-2">
                <Link href={`/admin/dashboard/products/${p.id}`}>
                  <h2 className="font-semibold text-lg">{p.title}</h2>
                </Link>
                <p className="text-sm text-muted-foreground">{p.description}</p>
                <p className="text-sm text-muted-foreground">
                  Created on {new Date(p.createdAt!).toLocaleDateString()}
                </p>
                <p className="font-bold">${(p.price / 100).toFixed(2)}</p>
                <div className="flex justify-between items-center mt-2">
                  {!p.isPublished && (
                    <Button
                      disabled={isPending}
                      onClick={() => handlePublish(p.id)}
                      className="bg-green-600 hover:bg-green-700">
                      {isPending ? "Publishing..." : "Publish"}
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        {deleteId === p.id && isDeleting ? (
                          <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full" />
                        ) : (
                          <Ellipsis size={16} />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDialog(p)}>
                        <SquarePen className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/products/${p.id}`} target="_blank">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setProductToDelete(p);
                          setDeleteConfirmOpen(true);
                        }}
                        className="text-red-500">
                        <Trash className="mr-2 h-4 w-4 text-red-500" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      {productSelected && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit product</DialogTitle>
            </DialogHeader>
            <AddProductForm
              setOpen={() => setOpen(false)}
              products={{
                id: productSelected.id,
                title: productSelected.title,
                description: productSelected.description,
                price: productSelected.price.toString(),
                thumbnailUrl: productSelected.thumbnailUrl as string,
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this product?
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (productToDelete) {
                  handleDelete(productToDelete);
                  setDeleteConfirmOpen(false);
                }
              }}
              disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
