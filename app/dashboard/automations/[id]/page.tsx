"use client";

import { WorkflowBuilder } from "@/app/dashboard/automations/[id]/workflow-builder";
import { MainContent } from "@/components/layout/main-content";
import { Sidebar } from "@/components/sidebar/sidebar";
import type { Workflow } from "@/lib/types";
import { workflowService } from "@/lib/workflow-service";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AutomationPage() {
  const params = useParams();
  const router = useRouter();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!params.id) {
      setError(true);
      setLoading(false);
      return;
    }

    try {
      // Parse the ID parameter
      const id = Number.parseInt(params.id as string, 10);

      // Check if ID is valid
      if (isNaN(id)) {
        setError(true);
        setLoading(false);
        return;
      }

      // Get the workflow
      const foundWorkflow = workflowService.getWorkflow(id);

      // If workflow doesn't exist, show error
      if (!foundWorkflow) {
        console.error(`Workflow with ID ${id} not found`);
        setError(true);
        setLoading(false);
        return;
      }

      setWorkflow(foundWorkflow);
      setLoading(false);
    } catch (err) {
      console.error("Error loading workflow:", err);
      setError(true);
      setLoading(false);
    }
  }, [params.id]);

  // Handle error state
  if (error) {
    return (
      <div className="flex h-screen bg-[#1a1a1e] text-white">
        <Sidebar />
        <MainContent>
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">404 - Automation Not Found</h1>
              <p className="text-gray-400 mb-8">The automation you're looking for doesn't exist or has been removed.</p>
              <button onClick={() => router.push("/dashboard/automations")} className="text-blue-400 hover:underline">
                Return to Automations
              </button>
            </div>
          </div>
        </MainContent>
      </div>
    );
  }

  // Handle loading state
  if (loading) {
    return (
      <div className="flex h-screen bg-[#1a1a1e] text-white">
        <Sidebar />
        <MainContent>
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Loading automation...</h1>
            </div>
          </div>
        </MainContent>
      </div>
    );
  }

  // Render workflow builder when workflow is loaded
  return workflow && <WorkflowBuilder initialWorkflow={workflow} workflowId={workflow.id as number} />;
}
