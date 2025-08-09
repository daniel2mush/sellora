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
import { LogOutIcon } from "lucide-react";
import { AlertDialogFun } from "../navigation/desktop";
import { signOut, useSession } from "@/lib/authClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function MoreOption() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
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

  return (
    <div>
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
          {" "}
          <Link href={"/auth"}>Login</Link>
        </Button>
      )}
    </div>
  );
}
