"use client";

import type React from "react";

import { SidebarToggle } from "@/components/sidebar/sidebar";
import { useSidebar } from "@/components/sidebar/sidebar-context";
import { cn } from "@/lib/utils";

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isOpen, isMobile } = useSidebar();

  return (
    <main
      className={cn(
        "flex-1 overflow-auto transition-all duration-300 ease-in-out",
        // Add padding when sidebar is collapsed on desktop
        !isOpen && !isMobile && "pl-[70px]",
        // Reset padding when sidebar is open
        isOpen && !isMobile && "pl-[200px]",
        // No padding on mobile
        isMobile && "pl-0"
      )}
    >
      <SidebarToggle />
      {children}
    </main>
  );
}
