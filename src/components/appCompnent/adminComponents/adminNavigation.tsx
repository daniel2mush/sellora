"use client";

import {
  Bell,
  Inbox,
  LogOutIcon,
  Mail,
  MessageCircle,
  Search,
  Settings,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { signOut, useSession } from "@/lib/authClient";
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
} from "../../ui/alert-dialog";
import { SetUserToAdminActions } from "@/app/actions/userActions/userActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

export default function AdminNavigation() {
  const { data: session, isPending } = useSession();
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
  return (
    <div className=" sticky top-0 left-0 right-0 flex items-center   justify-end   w-full gap-7 px-5 py-2 ml-10 mt-4">
      {/* Search  */}

      {/* <div className=" gap-3 flex items-center border rounded-xl py-1 px-2 w-full max-w-[50%]">
        <input
          placeholder="Search here....."
          className=" border-0 focus:outline-0 w-full "
        />
        <Button variant={"ghost"} size={"icon"}>
          <Search />
        </Button>
      </div> */}
      <div className="flex items-center gap-10  pr-10 ">
        {/* notificatin and messages */}

        <div className="flex justify-center items-center gap-8  ">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="relative cursor-pointer bg-gray-200 p-1.5 rounded-full">
                <Bell size={20} />
                <span className=" absolute top-0 bg-red-400 text-white text-sm rounded-full h-3 w-3 p-2 flex items-center justify-center right-0 -translate-y-2 translate-x-2">
                  1
                </span>
              </div>
            </DropdownMenuTrigger>
          </DropdownMenu>
          {/* Messages */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="relative cursor-pointer  bg-gray-200 p-1.5 rounded-full">
                <Mail size={20} />
                <span className=" absolute top-0 bg-red-400 text-white text-sm rounded-full h-3 w-3 p-2 flex items-center justify-center right-0 -translate-y-2 translate-x-2">
                  5
                </span>
              </div>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
        <div>
          {/* profile */}
          {isPending ? (
            <div />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className=" border-0 active:outline-0 focus:outline-0">
                <div className=" flex items-center justify-center gap-2">
                  <Avatar>
                    <AvatarFallback className=" bg-amber-700 text-white">
                      {session.user.name.charAt(0)}
                    </AvatarFallback>
                    <AvatarImage
                      src={session.user?.image as string}
                      alt="profile"
                    />
                  </Avatar>
                  <div className=" flex  flex-col items-start ">
                    <h1 className=" text font-bold">{session.user.name}</h1>
                    <p className=" text-sm text-muted-foreground">
                      {session.user.role}
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className=" w-56" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    {" "}
                    <User /> Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {" "}
                    <Mail /> Inbox
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {" "}
                    <Settings /> Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handleLogout()}>
                    <LogOutIcon />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </div>
  );
}
