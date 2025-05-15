import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { AppBar } from "@/components";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Modern dashboard application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <SidebarProvider>
            <DashboardSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 justify-between items-center gap-2 border-b px-4 bg-background">
                <SidebarTrigger className="-ml-1" />
                <AppBar />
              </header>
              <main className="flex-1 overflow-auto bg-background">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
