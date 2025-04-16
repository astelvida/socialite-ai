"use client"

import { Button } from "@/components/ui/button"
import { ResponseSection } from "@/components/workflow/response-section"
import { TriggerSection } from "@/components/workflow/trigger-section"
import { useIsMobile } from "@/hooks/use-mobile"
import { type Workflow, ResponseType, TriggerType } from "@/lib/types"
import { workflowService } from "@/lib/workflow-service"
import { Pencil, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface WorkflowBuilderProps {
  initialWorkflow?: Workflow
  workflowId?: number
}

export function WorkflowBuilder({ initialWorkflow, workflowId }: WorkflowBuilderProps) {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [isSaving, setIsSaving] = useState(false)
  const [workflow, setWorkflow] = useState<Workflow>(
    initialWorkflow || {
      id: undefined,
      name: "Direct traffic towards website",
      triggers: [
        {
          type: TriggerType.COMMENT,
          description: "User comments on my post",
          keywords: ["Yes", "Lets Go", "Interested", "Where do I Start?"],
          additionalInfo: "Asking about where to get started or how should they proceed",
        },
      ],
      responses: [
        {
          type: ResponseType.FIXED_MESSAGE,
          content:
            "Great to hear back from you, the link to our website is figma.com. Let us know what do you think about it. Thanks and have a great day!",
        },
      ],
      createdAt: new Date().toISOString(),
      isActive: false,
    },
  )

  const addTrigger = (trigger: Workflow["triggers"][0]) => {
    setWorkflow((prev) => ({
      ...prev,
      triggers: [...prev.triggers, trigger],
    }))
  }

  const updateTrigger = (index: number, trigger: Workflow["triggers"][0]) => {
    setWorkflow((prev) => ({
      ...prev,
      triggers: prev.triggers.map((t, i) => (i === index ? trigger : t)),
    }))
  }

  const removeTrigger = (index: number) => {
    setWorkflow((prev) => ({
      ...prev,
      triggers: prev.triggers.filter((_, i) => i !== index),
    }))
  }

  const setResponse = (response: Workflow["responses"][0]) => {
    setWorkflow((prev) => ({
      ...prev,
      responses: [response],
    }))
  }

  const saveWorkflow = () => {
    setIsSaving(true)
    try {
      if (workflowId !== undefined) {
        workflowService.updateWorkflow(workflowId, workflow)
        toast.success("Automation updated", {
          description: "Your automation has been updated successfully.",
        })
      } else {
        workflowService.createWorkflow(workflow)
        toast.success("Automation created", {
          description: "Your automation has been created successfully.",
        })
      }
      router.push("/dashboard/automations");
    } catch (error) {
      toast.error("Error", {
        description: "There was an error saving your automation.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const activateWorkflow = () => {
    setWorkflow((prev) => ({
      ...prev,
      isActive: true,
    }))

    saveWorkflow()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="h-auto md:h-16 border-b border-gray-800 flex flex-col md:flex-row items-start md:items-center px-4 py-3 md:py-0 justify-between">
        <div className="flex items-center space-x-2 mb-3 md:mb-0">
          <div className="text-gray-400">Automations</div>
          <div className="text-gray-400">&gt;</div>
          <div className="flex items-center">
            {workflow.name}
            <Pencil
              className="h-4 w-4 ml-2 text-gray-400 cursor-pointer"
              onClick={() => {
                const name = prompt("Enter automation name", workflow.name)
                if (name) setWorkflow((prev) => ({ ...prev, name }))
              }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center text-sm text-gray-400">
          {!isMobile && (
            <>
              <div>All updates are automatically saved</div>
              <div className="mx-4">Changes Saved</div>
              <div>
                <span>Undo</span>
                <span className="mx-2">|</span>
                <span>Redo</span>
              </div>
            </>
          )}
          <Button
            variant="outline"
            className="border-gray-700 bg-gray-800 text-white"
            onClick={saveWorkflow}
            disabled={isSaving}
          >
            <div className="w-3 h-3 bg-blue-500 rounded-sm mr-2"></div>
            Save Draft
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={activateWorkflow} disabled={isSaving}>
            <Play className="h-4 w-4 mr-2" />
            Set active
          </Button>
        </div>
      </header>

      {/* Workflow Builder */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-3xl mx-auto">
          {/* When Section */}
          <TriggerSection
            triggers={workflow.triggers}
            onAddTrigger={addTrigger}
            onUpdateTrigger={updateTrigger}
            onRemoveTrigger={removeTrigger}
          />

          {/* Connector Line */}
          <div className="flex justify-center my-6">
            <div className="h-12 w-0.5 bg-gray-700"></div>
          </div>

          {/* Then Section */}
          <ResponseSection response={workflow.responses[0]} onSetResponse={setResponse} />
        </div>
      </div>
    </div>
  )
}
