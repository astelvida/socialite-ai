import { Sidebar } from "@/components/sidebar/sidebar"
import { AutomationsView } from "@/components/automations/automations-view"
import { MainContent } from "@/components/layout/main-content"

export default function AutomationsPage() {
  return (
    <div className="flex h-screen bg-[#1a1a1e] text-white">
      <Sidebar />
      <MainContent>
        <AutomationsView />
      </MainContent>
    </div>
  )
}
