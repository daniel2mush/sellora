import AdminSideBar from "@/components/appCompnent/adminComponents/admin-sidebar";
import AdminNavigation from "@/components/appCompnent/adminComponents/adminNavigation";
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
        <AdminSideBar />
        <div className=" w-full">
          <div className=" flex items-center ">
            {" "}
            <SidebarTrigger />
            <AdminNavigation />
          </div>

          <main className=" px-10 py-10"> {children}</main>
        </div>
      </SidebarProvider>
      <Toaster richColors />
    </section>
  );
}
