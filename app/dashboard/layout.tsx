import { MainContent } from "@/components/layout/main-content";
import { Sidebar } from "@/components/sidebar/sidebar";
import { SidebarProvider } from "@/components/sidebar/sidebar-context";
import type React from "react";

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  // await testRedis();

  // const data = await redis.keys("*");
  // console.log(data);

  // const data2 = await redis.json.get("people", "$");
  // console.log(data2);

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-[#1a1a1e] text-white">
        <Sidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}
