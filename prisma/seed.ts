import {
  ActionType,
  InstagramMediaType,
  IntegrationType,
  PrismaClient,
  Subscription,
  TriggerType,
} from "../src/app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Clean the database first (optional - for development)
  await cleanDatabase();

  // Create users
  const user1 = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      email: "demo@example.com",
      firstName: "Demo",
      lastName: "User",
      subscription: Subscription.PRO,
    },
  });

  // Create second user (will be used for future expansions)
  await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      email: "free@example.com",
      firstName: "Free",
      lastName: "User",
      subscription: Subscription.FREE,
    },
  });

  // Create integrations
  const instagramIntegration = await prisma.integration.create({
    data: {
      userId: user1.id,
      type: IntegrationType.INSTAGRAM,
      accountId: "123456789",
      accessToken: "instagram-access-token",
      refreshToken: "instagram-refresh-token",
      tokenExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true,
    },
  });

  // Create notion integration (will be used in future data expansions)
  await prisma.integration.create({
    data: {
      userId: user1.id,
      type: IntegrationType.NOTION,
      accountId: "notion123",
      accessToken: "notion-access-token",
      refreshToken: "notion-refresh-token",
      tokenExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true,
    },
  });

  // Create Instagram profile
  const instagramProfile = await prisma.instagramProfile.create({
    data: {
      id: "instagram-profile-id",
      scopedId: "instagram-scoped-id",
      username: "demouser",
      fullName: "Demo User",
      profilePicUrl: "https://example.com/profile.jpg",
      bio: "This is a demo Instagram profile for testing",
      website: "https://example.com",
      followerCount: 1500,
      followingCount: 500,
      mediaCount: 120,
      userId: user1.id,
      integrationId: instagramIntegration.id,
      isPrivate: false,
    },
  });

  // Create Instagram media
  const instagramMedia = await prisma.instagramMedia.create({
    data: {
      integrationId: instagramIntegration.id,
      instagramId: "instagram-media-id-1",
      ownerId: instagramProfile.id,
      mediaType: InstagramMediaType.POST,
      mediaUrl: "https://example.com/post1.jpg",
      thumbnailUrl: "https://example.com/post1-thumb.jpg",
      permalink: "https://instagram.com/p/abc123",
      caption: "This is my first post! #testing #demo",
      likeCount: 150,
      commentCount: 25,
      timestamp: new Date(),
      hashtags: ["testing", "demo"],
      mentions: ["@friend1", "@friend2"],
    },
  });

  // Create Instagram comments
  const instagramComment1 = await prisma.instagramComment.create({
    data: {
      instagramId: "instagram-comment-id-1",
      mediaId: instagramMedia.id,
      authorId: instagramProfile.id,
      text: "This is a test comment!",
      likeCount: 5,
      timestamp: new Date(),
    },
  });

  // Create a reply comment
  await prisma.instagramComment.create({
    data: {
      instagramId: "instagram-comment-id-2",
      mediaId: instagramMedia.id,
      authorId: instagramProfile.id,
      text: "This is a reply!",
      likeCount: 2,
      timestamp: new Date(),
      parentCommentId: instagramComment1.id,
    },
  });

  // Create Instagram messages
  await prisma.instagramMessage.create({
    data: {
      instagramId: "instagram-message-id-1",
      senderId: instagramProfile.id,
      text: "Hi there, I'm interested in your product",
      timestamp: new Date(),
      isRead: true,
    },
  });

  // Create triggers
  const dmTrigger = await prisma.trigger.create({
    data: {
      integrationId: instagramIntegration.id,
      type: TriggerType.DM,
      keywords: ["interested", "pricing", "help", "website"],
      isActive: true,
    },
  });

  const commentTrigger = await prisma.trigger.create({
    data: {
      integrationId: instagramIntegration.id,
      type: TriggerType.COMMENT,
      keywords: ["interested", "where can I buy", "how much", "available"],
      isActive: true,
    },
  });

  // Create workflows
  const interestedWorkflow = await prisma.workflow.create({
    data: {
      userId: user1.id,
      name: "Handle Interested Customers",
      description: "Respond to customers showing interest in products",
      isActive: true,
    },
  });

  const supportWorkflow = await prisma.workflow.create({
    data: {
      userId: user1.id,
      name: "Customer Support",
      description: "Answer common support questions",
      isActive: true,
    },
  });

  // Create workflow triggers (join table)
  await prisma.workflowTrigger.create({
    data: {
      workflowId: interestedWorkflow.id,
      triggerId: dmTrigger.id,
    },
  });

  await prisma.workflowTrigger.create({
    data: {
      workflowId: interestedWorkflow.id,
      triggerId: commentTrigger.id,
    },
  });

  // Create actions
  await prisma.action.create({
    data: {
      workflowId: interestedWorkflow.id,
      type: ActionType.AI_GENERATED,
      name: "Send Product Information",
      description: "Send AI-generated info about our products",
      order: 1,
      config: {
        prompt:
          "You are a helpful sales assistant. Provide information about our products when customers show interest.",
        temperature: 0.7,
        maxLength: 300,
      },
      isActive: true,
    },
  });

  await prisma.action.create({
    data: {
      workflowId: interestedWorkflow.id,
      type: ActionType.HUMAN_INPUT,
      name: "Follow-up After 2 Days",
      description: "Send a follow-up message after 2 days",
      order: 2,
      config: {
        delayHours: 48,
        messageTemplate:
          "Hi {{name}}, just following up on our previous conversation. Let me know if you have any questions!",
      },
      isActive: true,
    },
  });

  await prisma.action.create({
    data: {
      workflowId: supportWorkflow.id,
      type: ActionType.AI_GENERATED,
      name: "Answer Support Question",
      description: "Use AI to answer common support questions",
      order: 1,
      config: {
        prompt: "You are a helpful support agent. Answer customer questions about our products and services.",
        temperature: 0.5,
        maxLength: 500,
      },
      isActive: true,
    },
  });

  console.log("Seed data created successfully!");
}

// Helper function to clean the database for development
async function cleanDatabase() {
  // Delete in the correct order to respect foreign keys
  await prisma.instagramMessage.deleteMany({});
  await prisma.instagramComment.deleteMany({});
  await prisma.instagramMedia.deleteMany({});
  await prisma.action.deleteMany({});
  await prisma.workflowTrigger.deleteMany({});
  await prisma.trigger.deleteMany({});
  await prisma.workflow.deleteMany({});
  await prisma.instagramProfile.deleteMany({});
  await prisma.integration.deleteMany({});
  await prisma.user.deleteMany({});
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
