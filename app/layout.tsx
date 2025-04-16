import "@/app/globals.css";
import { SidebarProvider } from "@/components/sidebar/sidebar-context";
import { Toaster } from "@/components/ui/sonner";
import type React from "react";

export const metadata = {
  title: "Smart AI",
  description: "Smart AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#1a1a1e] text-white">
        <SidebarProvider>{children}</SidebarProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
