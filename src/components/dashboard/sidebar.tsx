"use client";

import {
  Home,
  BarChart2,
  ShoppingCart,
  Users,
  Settings,
  Search,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInput,
  SidebarSeparator,
} from "@/components/ui/sidebar";

export function DashboardSidebar() {
  const pathname = usePathname();

  const mainNavItems = [
    { title: "Dashboard", icon: Home, href: "/" },
    { title: "Analytics", icon: BarChart2, href: "/analytics" },
    { title: "Products", icon: ShoppingCart, href: "/products" },
    { title: "Customers", icon: Users, href: "/customers" },
    { title: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="pb-0">
        <div className="flex items-center px-2 py-3">
          <div className="flex items-center gap-2 font-semibold text-xl">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              D
            </div>
            <span>Dashboard</span>
          </div>
        </div>
        <SidebarGroup className="py-0">
          <SidebarGroupContent className="relative">
            <SidebarInput placeholder="Search..." className="pl-8" />
            <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Reports</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/reports/sales">
                    <BarChart2 className="h-4 w-4" />
                    <span>Sales Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/reports/inventory">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Inventory Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="w-full">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
