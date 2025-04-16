"use client"

import { ArrowRight, BarChart2, Search, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ActivityChart } from "@/components/dashboard/activity-chart"
import { useRouter } from "next/navigation"
import { workflowService } from "@/lib/workflow-service"
import { toast } from "sonner"
import { useState } from "react"

export function DashboardView() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateAutomation = () => {
    setIsCreating(true)
    try {
      // Create a new empty workflow and get its ID
      const newWorkflowId = workflowService.createEmptyWorkflow()

      // Show success toast
      toast.success("New automation created", {
        description: "You can now configure your automation.",
      })

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search by name, email or status"
            className="max-w-md bg-gray-800 border-gray-700 text-white"
            prefix={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateAutomation} disabled={isCreating}>
          <Zap className="h-4 w-4 mr-2" />
          {isCreating ? "Creating..." : "Create an Automation"}
        </Button>
      </div>

      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Welcome back,</h2>
          <h1 className="text-4xl font-bold">Web Prodigies!</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-900 to-blue-950 border-gray-800">
            <CardHeader>
              <CardTitle>Set-up Auto Replies</CardTitle>
              <CardDescription className="text-gray-300">Deliver a product lineup through Instagram DM</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">Get products in front of your followers in as many places</p>
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  className="rounded-full bg-blue-800 hover:bg-blue-700 h-10 w-10 p-0"
                  onClick={handleCreateAutomation}
                  disabled={isCreating}
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900 to-blue-950 border-gray-800">
            <CardHeader>
              <CardTitle>Answer Questions with AI</CardTitle>
              <CardDescription className="text-gray-300">Identify and respond to queries with AI</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">The intention of the message will be automatically detected</p>
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  className="rounded-full bg-blue-800 hover:bg-blue-700 h-10 w-10 p-0"
                  onClick={handleCreateAutomation}
                  disabled={isCreating}
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900 to-blue-950 border-gray-800">
            <CardHeader>
              <CardTitle>Answer Questions with AI</CardTitle>
              <CardDescription className="text-gray-300">Identify and respond to queries with AI</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">The intention of the message will be automatically detected</p>
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  className="rounded-full bg-blue-800 hover:bg-blue-700 h-10 w-10 p-0"
                  onClick={handleCreateAutomation}
                  disabled={isCreating}
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-8">
        <Card className="bg-[#1e1e24] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-blue-400" />
              <CardTitle>Automated Activity</CardTitle>
            </div>
            <Tabs defaultValue="yesterday">
              <TabsList className="bg-gray-800">
                <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
                <TabsTrigger value="30days">Last 30 Days</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-4">Automated 0 out of 1 interactions</p>
            <ActivityChart />
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Card className="bg-[#252530] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Comments</CardTitle>
                  <CardDescription>On your posts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">
                    50<span className="text-xl">%</span>
                  </div>
                  <p className="text-sm text-gray-400">3 out of 6 comments replied</p>
                </CardContent>
              </Card>
              <Card className="bg-[#252530] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Direct Message</CardTitle>
                  <CardDescription>On your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">
                    50<span className="text-xl">%</span>
                  </div>
                  <p className="text-sm text-gray-400">3 out of 6 DMs replied</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
