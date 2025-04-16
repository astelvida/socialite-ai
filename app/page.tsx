import { Sidebar } from "@/components/sidebar/sidebar"
import { DashboardView } from "@/components/dashboard/dashboard-view"
import { MainContent } from "@/components/layout/main-content"

export default function Home() {
  return (
    <div className="flex h-screen bg-[#1a1a1e] text-white">
      <Sidebar />
      <MainContent>
        <DashboardView />
      </MainContent>
    </div>
  )
}
