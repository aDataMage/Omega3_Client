import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSideBar } from "@/components";
import { cookies } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSideBar />
      <main className="w-full mx-0 px-0 py-10 relative">
        <SidebarTrigger className="self-center sticky top-1/2 bottom-1/2 z-20" />
        {children}
      </main>
    </SidebarProvider>
  );
}
