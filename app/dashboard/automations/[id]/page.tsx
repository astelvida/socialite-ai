import { WorkflowBuilder } from "@/app/dashboard/automations/[id]/workflow-builder";
import NotFound from "@/app/not-found";
import { workflowService } from "@/lib/workflow-service";

export default async function AutomationPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const foundWorkflow = workflowService.getWorkflow(params.id);

  if (!foundWorkflow) {
    return <NotFound />;
  }

  return <WorkflowBuilder initialWorkflow={foundWorkflow} workflowId={foundWorkflow.id as number} />;
}
