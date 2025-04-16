"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { workflowService } from "@/lib/workflow-service";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  Menu,
  Settings,
  User,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useSidebar } from "./sidebar-context";
const navItems = [
  {
    href: "/dashboard",
    icon: <Home className="h-8 w-8 flex-shrink-0" />,
    label: "Home",
  },
  {
    href: "/dashboard/automations",
    icon: <Zap className="h-8 w-8 flex-shrink-0" />,
    label: "Automations",
  },
  {
    href: "/dashboard/integrations",
    icon: <Bell className="h-8 w-8 flex-shrink-0" />,
    label: "Integrations",
  },
  {
    href: "/dashboard/settings",
    icon: <Settings className="h-8 w-8 flex-shrink-0" />,
    label: "Settings",
  },
  {
    href: "/dashboard/contacts",
    icon: <User className="h-8 w-8 flex-shrink-0" />,
    label: "Contacts",
  },
  // {
  //   href: "/help",
  //   icon: <HelpCircle className="h-8 w-8 flex-shrink-0" />,
  //   label: "Help",
  // },
  // {
  //   href: "/dashboard/profile",
  //   icon: <User className="h-5 w-5 flex-shrink-0" />,
  //   label: "Profile",
  // },
];

export function SidebarToggle() {
  const { toggleSidebar, isOpen } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 hover:bg-gray-700"
      onClick={toggleSidebar}
      aria-label="Toggle sidebar"
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </Button>
  );
}

const DotIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  );
};

export function CustomUserButton() {
  return (
    <header>
      <UserButton>
        <UserButton.MenuItems>
          <UserButton.Action
            label="Open chat"
            labelIcon={<DotIcon />}
            onClick={() => alert("init chat")}
          />
        </UserButton.MenuItems>
      </UserButton>
    </header>
  );
}

export function Sidebar() {
  const router = useRouter();
  const { user } = useUser();
  const [isCreating, setIsCreating] = useState(false);
  const { isOpen, isMobile, toggleSidebar, closeSidebar } = useSidebar();

  const handleCreateAutomation = () => {
    setIsCreating(true);
    try {
      // Create a new empty workflow and get its ID
      const newWorkflowId = workflowService.createEmptyWorkflow();

      // Show success toast
      toast.success("New automation created", {
        description: "You can now configure your automation.",
      });

      // Close sidebar on mobile after navigation
      if (isMobile) {
        closeSidebar();
      }

      // Add a small delay before redirecting to ensure the workflow is created
      setTimeout(() => {
        // Redirect to the new workflow's detail page
        router.push(`/dashboard/automations/${newWorkflowId}`);
      }, 100);
    } catch (error) {
      console.error("Error creating automation:", error);
      toast.error("Error creating automation", {
        description: "There was a problem creating your automation. Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const NavItem = ({
    href,
    icon,
    children,
  }: {
    href: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => {
    return (
      <Link href={href} onClick={isMobile ? closeSidebar : undefined}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300",
            !isOpen && !isMobile && "justify-center px-2"
          )}
        >
          {icon}
          <span
            className={cn(
              "transition-all duration-300",
              !isOpen && !isMobile ? "w-0 opacity-0 overflow-hidden" : "ml-2"
            )}
          >
            {children}
          </span>
        </Button>
      </Link>
    );
  };

  const sidebarContent = (
    <div className="h-full flex flex-col border-r border-gray-800 bg-[#1a1a1e] relative">
      {/* Collapse button - only visible on desktop */}
      {!isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 h-6 w-6 rounded-full bg-gray-800 border border-gray-700 z-50 hover:bg-gray-700 transition-all duration-300"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </Button>
      )}

      <div className={cn("p-6 flex items-center", !isOpen && !isMobile && "justify-center")}>
        <div
          className={cn(
            "text-[#a3b3ff] text-3xl font-bold transition-all duration-300",
            !isOpen && !isMobile && "scale-90"
          )}
        >
          {isOpen || isMobile ? "Side" : "S"}
        </div>
      </div>

      <div className="flex-1 px-3 py-2 overflow-hidden">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <div key={item.href}>
              <NavItem href={item.href} icon={item.icon}>
                {item.label}
              </NavItem>
            </div>
          ))}
        </nav>
      </div>

      <div
        className={cn(
          "mt-auto p-4 transition-all duration-300",
          !isOpen && !isMobile && "scale-90"
        )}
      >
        {(isOpen || isMobile) && (
          <div className="bg-gray-900 rounded-lg p-4 animate-in fade-in-50 duration-300">
            <div className="text-sm font-medium">
              Upgrade to <span className="text-purple-400">Smart AI</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Unlock all features including AI and more
            </div>
            <Button className="w-full mt-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Upgrade
            </Button>
          </div>
        )}

        <div
          className={cn(
            "flex items-center mt-4 text-sm gap-2",
            !isOpen && !isMobile && "justify-center"
          )}
        >
          <CustomUserButton />

          {(isOpen || isMobile) && (
            <div className="animate-in fade-in-50 duration-300">
              <div className="font-medium flex items-center">
                {user?.fullName || user?.username}
                <ChevronDown className="h-4 w-4 ml-1" />
              </div>
              <div className="text-xs text-gray-400"> {user?.emailAddresses[0].emailAddress}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // For mobile: use a Sheet component
  if (isMobile) {
    return (
      <>
        <SidebarToggle />
        <Sheet open={isOpen} onOpenChange={closeSidebar}>
          <SheetContent side="left" className="p-0 w-[250px] border-r border-gray-800">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // For desktop: use a regular sidebar with transitions
  return (
    <div
      className={cn(
        "h-screen transition-all duration-300 ease-in-out overflow-hidden",
        isOpen ? "w-[200px]" : "w-[70px]"
      )}
    >
      {sidebarContent}
    </div>
  );
}
