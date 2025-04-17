"use client"

import { useState } from "react"
import { Info, Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TriggerType, type Workflow } from "@/lib/types"
import { toast } from "sonner"

interface TriggerSectionProps {
  triggers: Workflow["triggers"]
  onAddTrigger: (trigger: Workflow["triggers"][0]) => void
  onUpdateTrigger: (index: number, trigger: Workflow["triggers"][0]) => void
  onRemoveTrigger: (index: number) => void
}

export function TriggerSection({ triggers, onAddTrigger, onUpdateTrigger, onRemoveTrigger }: TriggerSectionProps) {
  const [newKeyword, setNewKeyword] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentTrigger, setCurrentTrigger] = useState<{
    index?: number
    type: TriggerType
    description: string
    keywords: string[]
    additionalInfo: string
  }>({
    type: TriggerType.COMMENT,
    description: "",
    keywords: [],
    additionalInfo: "",
  })

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      setCurrentTrigger((prev) => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()],
      }))
      setNewKeyword("")
    }
  }

  const handleRemoveKeyword = (index: number) => {
    setCurrentTrigger((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index),
    }))
  }

  const handleSaveTrigger = () => {
    if (!currentTrigger.description) {
      toast.error("Missing description", {
        description: "Please provide a description for the trigger.",
      })
      return
    }

    if (currentTrigger.keywords.length === 0) {
      toast.error("Missing keywords", {
        description: "Please add at least one keyword for the trigger.",
      })
      return
    }

    if (currentTrigger.index !== undefined) {
      onUpdateTrigger(currentTrigger.index, currentTrigger)
      toast.success("Trigger updated", {
        description: "Your trigger has been updated successfully.",
      })
    } else {
      onAddTrigger(currentTrigger)
      toast.success("Trigger added", {
        description: "Your trigger has been added successfully.",
      })
    }
    setDialogOpen(false)
    resetTrigger()
  }

  const resetTrigger = () => {
    setCurrentTrigger({
      type: TriggerType.COMMENT,
      description: "",
      keywords: [],
      additionalInfo: "",
    })
  }

  const editTrigger = (index: number) => {
    setCurrentTrigger({
      ...triggers[index],
      index,
    })
    setDialogOpen(true)
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center mr-2">
          <Info className="h-4 w-4" />
        </div>
        <div className="text-xl font-medium">When..</div>
      </div>

      {triggers.map((trigger, index) => (
        <Card key={index} className="bg-gray-800 border-gray-700 p-4 mb-4">
          <div className="flex items-center mb-2">
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center mr-2">
              <Info className="h-3 w-3" />
            </div>
            <div className="font-medium">{trigger.description}</div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-gray-400 hover:text-white"
              onClick={() => editTrigger(index)}
            >
              Edit
            </Button>
            {triggers.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                onClick={() => onRemoveTrigger(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="text-sm text-gray-400 mb-3">{trigger.additionalInfo}</div>
          <div className="flex flex-wrap gap-2">
            {trigger.keywords.map((keyword, keywordIndex) => (
              <Badge
                key={keywordIndex}
                className="bg-blue-700 hover:bg-blue-800 text-white rounded-full px-3 py-1 flex items-center"
              >
                {keyword}
                <span className="ml-1 text-xs">×</span>
              </Badge>
            ))}
          </div>
        </Card>
      ))}

      {triggers.length > 0 && triggers.length < 2 && (
        <div className="flex items-center justify-center text-gray-500 text-sm my-2">or</div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full border-dashed border-blue-500 text-blue-400 hover:bg-blue-900/20"
            onClick={resetTrigger}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Trigger
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Configure Trigger</DialogTitle>
            <DialogDescription className="text-gray-400">Set up what will trigger this automation</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Trigger Type</label>
              <Select
                value={currentTrigger.type}
                onValueChange={(value) =>
                  setCurrentTrigger((prev) => ({
                    ...prev,
                    type: value as TriggerType,
                  }))
                }
              >
                <SelectTrigger className="bg-gray-900 border-gray-700">
                  <SelectValue placeholder="Select trigger type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value={TriggerType.COMMENT}>Comment on Post</SelectItem>
                  <SelectItem value={TriggerType.DM}>Direct Message</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={currentTrigger.description}
                onChange={(e) =>
                  setCurrentTrigger((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="E.g., User comments on my post"
                className="bg-gray-900 border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Information</label>
              <Textarea
                value={currentTrigger.additionalInfo}
                onChange={(e) =>
                  setCurrentTrigger((prev) => ({
                    ...prev,
                    additionalInfo: e.target.value,
                  }))
                }
                placeholder="E.g., Asking about where to get started"
                className="bg-gray-900 border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Keywords</label>
              <div className="flex">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Add keyword"
                  className="bg-gray-900 border-gray-700 mr-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddKeyword()
                    }
                  }}
                />
                <Button onClick={handleAddKeyword}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {currentTrigger.keywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    className="bg-blue-700 hover:bg-blue-800 text-white rounded-full px-3 py-1 flex items-center"
                  >
                    {keyword}
                    <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => handleRemoveKeyword(index)} />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTrigger}>Save Trigger</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
