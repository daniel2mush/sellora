"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Compass, DollarSign, FolderHeart, LogOut, User } from "lucide-react";
import { signOut, useSession } from "@/lib/authClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { BecomeSellerDialog } from "../../SellerDialog/SellerDialog";
import { useState } from "react";

export default function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const { data, error } = await signOut();
      if (data?.success) {
        toast.success("Logged out successfully");
        router.refresh();
      } else {
        toast.error(error?.message || "Logout failed");
      }
    } catch (e) {
      console.error(e);
      toast.error("An unexpected error occurred");
    }
  };

  if (isPending) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (!session?.user) {
    return (
      <Button variant="default" asChild>
        <Link href="/auth">Login</Link>
      </Button>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full p-0">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={session.user.image as string}
                alt={session.user.name}
              />
              <AvatarFallback className="bg-amber-700 text-white">
                {session.user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/products">
                <Compass className="mr-2 h-4 w-4" />
                <span>Explore</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/purchases">
                <DollarSign className="mr-2 h-4 w-4" />
                <span>Purchases</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/collection">
                <FolderHeart className="mr-2 h-4 w-4" />
                <span>Collections</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)} className="p-0">
            <User className="mr-2 h-4 w-4" />
            <span>Become a Seller</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {open && (
        <BecomeSellerDialog
          userId={session.user.id}
          open={open}
          setOpen={() => setOpen((p) => !p)}
        />
      )}
    </>
  );
}
