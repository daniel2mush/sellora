"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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
} from "../ui/alert-dialog";
import { SetUserToAdminActions } from "@/app/actions/userActions";

export default function NavigationItems() {
  const { data: session, isPending } = useSession();

  const pathname = usePathname();
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
      name: "My Orders",
      path: "/dashboard/orders",
    },
    {
      name: "Downloads",
      path: "/dashboard/downloads",
    },
  ];

  const router = useRouter();

  const handleLogout = async () => {
    try {
      const data = await signOut();
      if (data.data?.success) {
        toast.success("Logged out sucessfully");
        router.refresh();
        return;
      }
      toast.error(data.error?.message);
    } catch (e) {
      console.log(e);
    }
  };

  if (pathname === "/auth") {
    return null;
  }

  return (
    <div className=" flex items-center justify-between h-20 border-b-1 w-full px-20">
      {/* logo */}
      <div className="  md:text-2xl font-black text-primary">SELLORA</div>
      {/* Menu */}
      <div className=" flex justify-center items-center gap-4 ">
        {navMenu.map((n) => {
          const isPath = pathname === n.path;
          return (
            <div
              key={n.name}
              className={
                isPath
                  ? "font-bold t border-b-2  border-primary  "
                  : " text-gray-500"
              }>
              <Link href={n.path}> {n.name}</Link>
            </div>
          );
        })}
        {session?.user &&
          navSession.map((n) => {
            const isPath = pathname === n.path;
            return (
              <div
                key={n.name}
                className={
                  isPath
                    ? "font-bold t border-b-2  border-primary  "
                    : " text-gray-500"
                }>
                <Link href={n.path}> {n.name}</Link>
              </div>
            );
          })}
      </div>
      {/* profile */}
      {isPending ? (
        <div />
      ) : session?.user ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarFallback className=" bg-amber-700 text-white">
                {session.user.name.charAt(0)}
              </AvatarFallback>
              <AvatarImage src={session.user?.image as string} alt="profile" />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" w-56" align="end">
            <DropdownMenuLabel>
              <h1 className=" font-bold">{session.user.name}</h1>
              <p className=" text-sm text-muted-foreground">
                {session.user.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>Explore</DropdownMenuItem>
              <DropdownMenuItem>My Orders</DropdownMenuItem>
              <DropdownMenuItem>Downloads</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenu>
              <DropdownMenuItem>
                <AlertDialogFun userId={session.user.id} />
              </DropdownMenuItem>
            </DropdownMenu>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleLogout()}>
                <LogOutIcon />
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button className=" font-bold cursor-pointer">
          <Link href={"/auth"}>Login</Link>
        </Button>
      )}
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
