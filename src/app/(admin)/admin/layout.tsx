import AdminNavigation from "@/components/appCompnent/adminNavigation";
import AppSideBar from "@/components/appCompnent/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") redirect("/");

  return (
    <section>
      <SidebarProvider>
        <AppSideBar />
        <div className=" w-full">
          <div className=" flex items-center ">
            {" "}
            <SidebarTrigger />
            <AdminNavigation />
          </div>

          {children}
        </div>
      </SidebarProvider>
      <Toaster richColors />
    </section>
  );
}
