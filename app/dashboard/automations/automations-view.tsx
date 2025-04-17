"use client";

import { AutomationCard } from "@/app/dashboard/automations/automation-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Workflow } from "@/lib/types";
import { workflowService } from "@/lib/workflow-service";
import { Search, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function AutomationsView() {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Fetch workflows whenever the component mounts or after creating a new workflow
  const fetchWorkflows = () => {
    const allWorkflows = workflowService.getWorkflows();
    setWorkflows(allWorkflows);
  };

  useEffect(() => {
    console.log("fetching workflows");

    if (workflows.length === 0) {
      fetchWorkflows();
    }
    if (searchQuery) {
      setWorkflows(filteredWorkflows);
    }
  }, []);

  const filteredWorkflows = workflows.filter((workflow) =>
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeWorkflows = filteredWorkflows.filter((workflow) => workflow.isActive);
  const draftWorkflows = filteredWorkflows.filter((workflow) => !workflow.isActive);

  const handleCreateAutomation = () => {
    setIsCreating(true);
    try {
      // Create a new empty workflow and get its ID
      const newWorkflowId = workflowService.createEmptyWorkflow();

      // Refresh the workflows list
      fetchWorkflows();

      // Show success toast
      toast.success("New automation created", {
        description: "You can now configure your automation.",
      });

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

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center mb-6 md:mb-8">
        <Zap className="h-6 w-6 mr-2 text-blue-400" />
        <h1 className="text-2xl font-bold">Automations</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
        <div className="w-full md:flex-1">
          <Input
            type="text"
            placeholder="Search automations"
            className="w-full md:max-w-md bg-gray-800 border-gray-700 text-white"
            prefix={<Search className="h-4 w-4 text-gray-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex w-full md:w-auto gap-2 md:gap-4">
          <Link href="/dashboard/automations" className="flex-1 md:flex-auto">
            <Button variant="outline" className="w-full border-gray-700 bg-gray-800 text-white">
              Drafts
            </Button>
          </Link>
          <Button
            className="flex-1 md:flex-auto bg-blue-600 hover:bg-blue-700"
            onClick={handleCreateAutomation}
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create an Automation"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {draftWorkflows.length > 0 && (
          <>
            <h2 className="text-xl font-bold mt-6 mb-2">Drafts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {draftWorkflows.map((workflow) => (
                <AutomationCard key={workflow.id} workflow={workflow} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-8 bg-gray-800 rounded-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Upgrade to Pro</h2>
            <p className="text-gray-400">Focus on content creation and let us take care of the rest!</p>

            <div className="mt-4">
              <h3 className="text-2xl font-bold text-purple-400">Smart AI</h3>
              <p className="text-2xl font-bold">
                $99.99<span className="text-sm text-gray-400">/month</span>
              </p>
            </div>
          </div>
          <Button className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            Upgrade
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Active Automations</h2>
        <p className="text-gray-400 mb-4">All the live automations will show here</p>

        {activeWorkflows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeWorkflows.map((workflow) => (
              <AutomationCard key={workflow.id} workflow={workflow} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No active automations yet</p>
            <div className="mt-6 flex justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateAutomation} disabled={isCreating}>
                Create a New Automation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
