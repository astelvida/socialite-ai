export enum TriggerType {
  COMMENT = "comment",
  DM = "dm",
}

export enum ResponseType {
  FIXED_MESSAGE = "fixed_message",
  AI_CHATBOT = "ai_chatbot",
}

export interface Workflow {
  id?: number
  name: string
  triggers: {
    type: TriggerType
    description: string
    keywords: string[]
    additionalInfo: string
    index?: number
  }[]
  responses: {
    type: ResponseType
    content?: string
    aiPrompt?: string
  }[]
  createdAt?: string
  isActive?: boolean
}
