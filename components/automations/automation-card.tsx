import { Badge } from "@/components/ui/badge"
import type { Workflow } from "@/lib/types"
import Link from "next/link"
import { ResponseType } from "@/lib/types"

interface AutomationCardProps {
  workflow: Workflow
}

export function AutomationCard({ workflow }: AutomationCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const isAI = workflow.responses[0]?.type === ResponseType.AI_CHATBOT

  return (
    <Link href={`/automations/${workflow.id}`}>
      <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer h-full">
        <div className="mb-2">
          <h3 className="font-medium line-clamp-1">{workflow.name}</h3>
          <p className="text-sm text-gray-400">
            via {workflow.triggers[0]?.type === "comment" ? "reply on post" : "direct message"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {workflow.triggers[0]?.keywords.slice(0, 4).map((keyword, index) => (
            <Badge
              key={index}
              className={`
                ${index === 0 ? "bg-green-900 hover:bg-green-800" : ""}
                ${index === 1 ? "bg-purple-900 hover:bg-purple-800" : ""}
                ${index === 2 ? "bg-yellow-900 hover:bg-yellow-800" : ""}
                ${index === 3 ? "bg-red-900 hover:bg-red-800" : ""}
                text-white
              `}
            >
              {keyword}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">{formatDate(workflow.createdAt)}</div>
          <div className="flex items-center">
            {isAI && (
              <Badge className="bg-gray-700 text-purple-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-1"></div>
                Smart AI
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
