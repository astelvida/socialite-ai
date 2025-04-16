import { type Workflow, ResponseType, TriggerType } from "@/lib/types";

// This service would handle the actual automation logic
// In a real app, this would connect to a backend API
export class WorkflowService {
  private static instance: WorkflowService;

  private workflows: Workflow[] = [];
  private nextId = 1;

  private constructor() {
    // Initialize with some sample data
    this.workflows = [
      {
        id: this.nextId++,
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
        isActive: true,
      },
      {
        id: this.nextId++,
        name: "Answer product questions",
        triggers: [
          {
            type: TriggerType.DM,
            description: "User asks about product features",
            keywords: ["How does it work", "Features", "What can it do", "Pricing"],
            additionalInfo: "Questions about product functionality and pricing",
          },
        ],
        responses: [
          {
            type: ResponseType.FIXED_MESSAGE,
            content:
              "Thanks for your interest! Our product offers automated Instagram responses, AI-powered messaging, and analytics. Visit our website at example.com/pricing for detailed pricing information.",
          },
        ],
        createdAt: new Date().toISOString(),
        isActive: true,
      },
      {
        id: this.nextId++,
        name: "Support request handler",
        triggers: [
          {
            type: TriggerType.DM,
            description: "User needs help or support",
            keywords: ["Help", "Support", "Not working", "Issue", "Problem"],
            additionalInfo: "Support requests and troubleshooting",
          },
        ],
        responses: [
          {
            type: ResponseType.AI_CHATBOT,
            aiPrompt:
              "You are a helpful support assistant. Help the user troubleshoot their issue with our Instagram automation tool.",
          },
        ],
        createdAt: new Date().toISOString(),
        isActive: false,
      },
    ];
  }

  public static getInstance(): WorkflowService {
    if (!WorkflowService.instance) {
      WorkflowService.instance = new WorkflowService();
    }
    return WorkflowService.instance;
  }

  public getWorkflows(): Workflow[] {
    return this.workflows;
  }

  public getWorkflow(id: number | string): Workflow | undefined {
    const numericId = typeof id === "string" ? Number.parseInt(id, 10) : id;
    return this.workflows.find((workflow) => workflow.id === numericId);
  }

  public createEmptyWorkflow(): number {
    // Create a new empty workflow with default values
    const newId = this.nextId++;

    const newWorkflow: Workflow = {
      id: newId,
      name: "New Automation",
      triggers: [
        {
          type: TriggerType.COMMENT,
          description: "User comments on my post",
          keywords: ["Yes", "Interested"],
          additionalInfo: "Initial trigger",
        },
      ],
      responses: [
        {
          type: ResponseType.FIXED_MESSAGE,
          content: "Thank you for your interest!",
        },
      ],
      createdAt: new Date().toISOString(),
      isActive: false,
    };

    this.workflows.push(newWorkflow);

    // Log for debugging
    console.log(`Created new workflow with ID: ${newId}`);
    console.log(`Total workflows: ${this.workflows.length}`);
    console.log(`Workflow exists: ${this.getWorkflow(newId) !== undefined}`);

    return newId;
  }

  public createWorkflow(workflow: Workflow): Workflow {
    const newId = this.nextId++;
    const newWorkflow = {
      ...workflow,
      id: newId,
      createdAt: workflow.createdAt || new Date().toISOString(),
    };
    this.workflows.push(newWorkflow);
    return newWorkflow;
  }

  public updateWorkflow(id: number, workflow: Workflow): Workflow {
    const index = this.workflows.findIndex((w) => w.id === id);
    if (index === -1) {
      throw new Error(`Workflow with id ${id} not found`);
    }

    const updatedWorkflow = {
      ...workflow,
      id,
    };

    this.workflows[index] = updatedWorkflow;
    return updatedWorkflow;
  }

  public deleteWorkflow(id: number): void {
    const index = this.workflows.findIndex((w) => w.id === id);
    if (index !== -1) {
      this.workflows.splice(index, 1);
    }
  }

  // This method would process incoming messages/comments
  public async processMessage(message: string, type: "comment" | "dm"): Promise<string | null> {
    // Find a workflow that matches this message
    for (const workflow of this.workflows) {
      if (!workflow.isActive) continue;

      for (const trigger of workflow.triggers) {
        if (trigger.type === type) {
          // Check if any keywords match
          const matchesKeyword = trigger.keywords.some((keyword) =>
            message.toLowerCase().includes(keyword.toLowerCase())
          );

          if (matchesKeyword) {
            // We found a match, now generate a response
            const response = workflow.responses[0];

            if (response.type === ResponseType.FIXED_MESSAGE) {
              return response.content || "";
            } else if (response.type === ResponseType.AI_CHATBOT) {
              // In a real app, this would call an AI service
              return `AI response based on: ${response.aiPrompt}`;
            }
          }
        }
      }
    }

    return null; // No matching workflow found
  }
}

export const workflowService = WorkflowService.getInstance();
