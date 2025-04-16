"use client"

import type React from "react"

import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Home,
  Menu,
  Settings,
  User,
  X,
  Zap,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { workflowService } from "@/lib/workflow-service"
import { toast } from "sonner"
import { useState } from "react"
import { useSidebar } from "./sidebar-context"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function SidebarToggle() {
  const { toggleSidebar, isOpen } = useSidebar()

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
  )
}

export function Sidebar() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const { isOpen, isMobile, toggleSidebar, closeSidebar } = useSidebar()

  const handleCreateAutomation = () => {
    setIsCreating(true)
    try {
      // Create a new empty workflow and get its ID
      const newWorkflowId = workflowService.createEmptyWorkflow()

      // Show success toast
      toast.success("New automation created", {
        description: "You can now configure your automation.",
      })

      // Close sidebar on mobile after navigation
      if (isMobile) {
        closeSidebar()
      }

      // Add a small delay before redirecting to ensure the workflow is created
      setTimeout(() => {
        // Redirect to the new workflow's detail page
        router.push(`/automations/${newWorkflowId}`)
      }, 100)
    } catch (error) {
      console.error("Error creating automation:", error)
      toast.error("Error creating automation", {
        description: "There was a problem creating your automation. Please try again.",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const NavItem = ({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) => {
    return (
      <Link href={href} onClick={isMobile ? closeSidebar : undefined}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300",
            !isOpen && !isMobile && "justify-center px-2",
          )}
        >
          {icon}
          <span
            className={cn(
              "transition-all duration-300",
              !isOpen && !isMobile ? "w-0 opacity-0 overflow-hidden" : "ml-2",
            )}
          >
            {children}
          </span>
        </Button>
      </Link>
    )
  }

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
            !isOpen && !isMobile && "scale-90",
          )}
        >
          {isOpen || isMobile ? "Side" : "S"}
        </div>
      </div>

      <div className="flex-1 px-3 py-2 overflow-hidden">
        <nav className="space-y-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <NavItem href="/" icon={<Home className="h-5 w-5 flex-shrink-0" />}>
                    Home
                  </NavItem>
                </div>
              </TooltipTrigger>
              {!isOpen && !isMobile && <TooltipContent side="right">Home</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Link href="/contacts" onClick={isMobile ? closeSidebar : undefined}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-between text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300",
                        !isOpen && !isMobile && "justify-center px-2",
                      )}
                    >
                      <div className="flex items-center">
                        <User className="h-5 w-5 flex-shrink-0" />
                        <span
                          className={cn(
                            "transition-all duration-300",
                            !isOpen && !isMobile ? "w-0 opacity-0 overflow-hidden" : "ml-2",
                          )}
                        >
                          Contacts
                        </span>
                      </div>
                      <span
                        className={cn(
                          "text-xs text-gray-500 transition-all duration-300",
                          !isOpen && !isMobile && "hidden",
                        )}
                      >
                        4
                      </span>
                    </Button>
                  </Link>
                </div>
              </TooltipTrigger>
              {!isOpen && !isMobile && <TooltipContent side="right">Contacts</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <NavItem href="/automations" icon={<Zap className="h-5 w-5 flex-shrink-0" />}>
                    Automations
                  </NavItem>
                </div>
              </TooltipTrigger>
              {!isOpen && !isMobile && <TooltipContent side="right">Automations</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <NavItem href="/integrations" icon={<Bell className="h-5 w-5 flex-shrink-0" />}>
                    Integrations
                  </NavItem>
                </div>
              </TooltipTrigger>
              {!isOpen && !isMobile && <TooltipContent side="right">Integrations</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <NavItem href="/settings" icon={<Settings className="h-5 w-5 flex-shrink-0" />}>
                    Settings
                  </NavItem>
                </div>
              </TooltipTrigger>
              {!isOpen && !isMobile && <TooltipContent side="right">Settings</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </nav>
      </div>

      <Separator className="my-4 bg-gray-800" />

      <div className="px-3 py-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <NavItem
                  href="/profile"
                  icon={
                    <Avatar className="h-6 w-6 flex-shrink-0">
                      <AvatarImage src="/vibrant-street-market.png" />
                      <AvatarFallback>WP</AvatarFallback>
                    </Avatar>
                  }
                >
                  Profile
                </NavItem>
              </div>
            </TooltipTrigger>
            {!isOpen && !isMobile && <TooltipContent side="right">Profile</TooltipContent>}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <NavItem href="/help" icon={<HelpCircle className="h-5 w-5 flex-shrink-0" />}>
                  Help
                </NavItem>
              </div>
            </TooltipTrigger>
            {!isOpen && !isMobile && <TooltipContent side="right">Help</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className={cn("mt-auto p-4 transition-all duration-300", !isOpen && !isMobile && "scale-90")}>
        {(isOpen || isMobile) && (
          <div className="bg-gray-900 rounded-lg p-4 animate-in fade-in-50 duration-300">
            <div className="text-sm font-medium">
              Upgrade to <span className="text-purple-400">Smart AI</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">Unlock all features including AI and more</div>
            <Button className="w-full mt-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Upgrade
            </Button>
          </div>
        )}
        <div className={cn("flex items-center mt-4 text-sm", !isOpen && !isMobile && "justify-center")}>
          <Avatar className="h-6 w-6 mr-2 flex-shrink-0">
            <AvatarImage src="/vibrant-street-market.png" />
            <AvatarFallback>WP</AvatarFallback>
          </Avatar>
          {(isOpen || isMobile) && (
            <div className="animate-in fade-in-50 duration-300">
              <div className="font-medium flex items-center">
                Web Prodigies
                <ChevronDown className="h-4 w-4 ml-1" />
              </div>
              <div className="text-xs text-gray-400">johndoe@gmail.com</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

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
    )
  }

  // For desktop: use a regular sidebar with transitions
  return (
    <div
      className={cn(
        "h-screen transition-all duration-300 ease-in-out overflow-hidden",
        isOpen ? "w-[200px]" : "w-[70px]",
      )}
    >
      {sidebarContent}
    </div>
  )
}
