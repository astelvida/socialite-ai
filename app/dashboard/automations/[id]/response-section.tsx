"use client"

import { useState } from "react"
import { Info, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResponseType, type Workflow } from "@/lib/types"
import { toast } from "sonner"

interface ResponseSectionProps {
  response: Workflow["responses"][0]
  onSetResponse: (response: Workflow["responses"][0]) => void
}

export function ResponseSection({ response, onSetResponse }: ResponseSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [currentResponse, setCurrentResponse] = useState<Workflow["responses"][0]>(response)

  const handleSaveResponse = () => {
    if (
      currentResponse.type === ResponseType.FIXED_MESSAGE &&
      (!currentResponse.content || currentResponse.content.trim() === "")
    ) {
      toast.error("Missing message", {
        description: "Please provide a message for the response.",
      })
      return
    }

    if (
      currentResponse.type === ResponseType.AI_CHATBOT &&
      (!currentResponse.aiPrompt || currentResponse.aiPrompt.trim() === "")
    ) {
      toast.error("Missing AI prompt", {
        description: "Please provide instructions for the AI.",
      })
      return
    }

    onSetResponse(currentResponse)
    setIsEditing(false)
    toast.success("Response updated", {
      description: "Your response has been updated successfully.",
    })
  }

  const handleCancelEdit = () => {
    setCurrentResponse(response)
    setIsEditing(false)
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center mr-2">
          <Info className="h-4 w-4" />
        </div>
        <div className="text-xl font-medium">Then..</div>
      </div>

      {isEditing ? (
        <div className="border border-dashed border-blue-500 rounded-lg p-6">
          <Card className="bg-blue-600 rounded-lg p-4 mb-4">
            <div className="flex items-center mb-2">
              <Play className="h-4 w-4 mr-2" />
              <div className="font-medium">User will be sent the message</div>
            </div>
            <div className="text-sm text-blue-200">Enter the message that you want to be sent to the client</div>
          </Card>

          <div className="space-y-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Response Type</label>
              <Select
                value={currentResponse.type}
                onValueChange={(value) =>
                  setCurrentResponse((prev) => ({
                    ...prev,
                    type: value as ResponseType,
                  }))
                }
              >
                <SelectTrigger className="bg-gray-900 border-gray-700">
                  <SelectValue placeholder="Select response type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value={ResponseType.FIXED_MESSAGE}>Fixed Message</SelectItem>
                  <SelectItem value={ResponseType.AI_CHATBOT}>AI Chatbot</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {currentResponse.type === ResponseType.FIXED_MESSAGE ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">Message Content</label>
                <Textarea
                  value={currentResponse.content}
                  onChange={(e) =>
                    setCurrentResponse((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  placeholder="Enter your message here"
                  className="bg-gray-900 border-gray-700 min-h-[120px]"
                />
              </div>
            ) : (
              <Card className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  </div>
                  <div className="font-medium">Let Smart AI take over</div>
                </div>
                <div className="text-sm text-gray-400">Tell AI about your project. (Upgrade to use this feature)</div>
                <Textarea
                  value={currentResponse.aiPrompt || ""}
                  onChange={(e) =>
                    setCurrentResponse((prev) => ({
                      ...prev,
                      aiPrompt: e.target.value,
                    }))
                  }
                  placeholder="Tell AI what to respond with"
                  className="bg-gray-900 border-gray-700 mt-4 min-h-[80px]"
                />
              </Card>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveResponse}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <Card className="bg-gray-800 border-gray-700 p-4 mb-4">
          <div className="flex items-center mb-2">
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center mr-2">
              <Play className="h-3 w-3" />
            </div>
            <div className="font-medium">
              {response.type === ResponseType.FIXED_MESSAGE
                ? "User will be sent the message"
                : "AI will respond to the user"}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-gray-400 hover:text-white"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          </div>

          {response.type === ResponseType.FIXED_MESSAGE ? (
            <div className="text-sm text-gray-300">{response.content}</div>
          ) : (
            <div className="text-sm text-gray-300">
              <div className="font-medium mb-1">AI will respond based on:</div>
              {response.aiPrompt}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
