"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/authClient";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../ui/alert-dialog";
import { SetUserToAdminActions } from "@/app/actions/userActions/userActions";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import MoreOption from "../more/MoreOption";

export default function DesktopNavigation() {
  const { data: session, isPending } = useSession();

  const pathname = usePathname();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navMenu = [
    {
      name: "Home",
      path: "/",
    },

    {
      name: "Explore",
      path: "/products",
    },
  ];

  const navSession = [
    {
      name: "Purchases",
      path: "/dashboard/purchases",
    },
    {
      name: "Collections",
      path: "/dashboard/collection",
    },
  ];

  const router = useRouter();

  if (pathname === "/auth") {
    return null;
  }

  return (
    <div>
      <div className=" flex items-center justify-between h-20 border-b-1 w-full px-10">
        {/* logo */}
        <Link href={"/"} className=" relative w-20 md:w-32  h-16">
          <Image
            src={"/Logo.png"}
            alt="logo"
            fill
            className=" object-contain"
          />
        </Link>
        {/* Menu */}
        <nav className=" ">
          <ul className="flex justify-center items-center gap-4 ">
            {navMenu.map((n) => {
              const isPath = pathname === n.path;
              return (
                <li
                  key={n.name}
                  className={
                    isPath
                      ? "font-bold t border-b-2  border-primary  "
                      : " text-gray-500"
                  }>
                  <Link href={n.path}> {n.name}</Link>
                </li>
              );
            })}

            {session?.user &&
              navSession.map((n) => {
                const isPath = pathname === n.path;
                return (
                  <li
                    key={n.name}
                    className={
                      isPath
                        ? "font-bold t border-b-2  border-primary  "
                        : " text-gray-500"
                    }>
                    <Link href={n.path}> {n.name}</Link>
                  </li>
                );
              })}
          </ul>
        </nav>
        {/* More Option */}
        <MoreOption />
      </div>
    </div>
  );
}

export function AlertDialogFun({ userId }: { userId: string }) {
  const handleAdminSwitch = async () => {
    try {
      const { message, status } = await SetUserToAdminActions(userId);
      if (status) {
        toast.success(message);
        return;
      }
      toast.error(message);
    } catch (error) {
      console.log(error);

      toast.error(error as string);
    }
  };
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <h1>Become a seller</h1>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
            <AlertDialogDescription>
              Becoming a seller makes you put your products for sell, you cannot
              buy products or see products from other sellers
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAdminSwitch}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
