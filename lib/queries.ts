"use server";

import prisma from "@/lib/prisma";
import { Workflow } from "@/src/app/generated/prisma";
import { auth } from "@clerk/nextjs/server";

export async function saveInstagramProfile(profile, integrationId) {
  console.log("SAVING INSTAGRAM PROFILE", profile);

  const { userId } = await auth();
  if (!userId) {
    console.error("User not authenticated");
    return { error: "User not authenticated" };
  }
  const {
    user_id: instagramId,
    id: scopedId,
    username,
    profile_picture_url: profilePictureUrl,
    name,
    follows_count: followsCount,
    followers_count: followersCount,
    media_count: mediaCount
  } = profile;

  const newProfile = await prisma.instagramProfile.create({
    data: {
      instagramId,
      scopedId,
      username,
      name,
      profilePictureUrl,
      followsCount,
      followersCount,
      mediaCount,
      userId,
      integrationId
    }
  });

  console.log("SAVED INSTAGRAM PROFILE?", newProfile);
  return newProfile;
}

// const createMany = await prisma.user.createMany({
//   data: [
//     { name: "Bob", email: "bob@prisma.io" },
//     { name: "Bobo", email: "bob@prisma.io" }, // Duplicate unique key!
//     { name: "Yewande", email: "yewande@prisma.io" },
//     { name: "Angelique", email: "angelique@prisma.io" }
//   ],
//   skipDuplicates: true // Skip 'Bobo'
// });

export async function saveInstagramMedia(instagramMedia, integrationId) {
  const mappedMedia = instagramMedia.map(media => ({
    instagramId: media.id,
    ownerId: media.owner.id,
    username: media.username,
    mediaType: media.media_type,
    mediaUrl: media.media_url,
    permalink: media.permalink,
    caption: media.caption,
    timestamp: new Date(media.timestamp),
    integrationId: integrationId
  }));

  console.log("MAPPED MEDIA", mappedMedia);

  const newMedia = await prisma.instagramMedia.createMany({
    data: mappedMedia,
    skipDuplicates: true
  });
  return newMedia;
}

// Integration Queries
export async function createIntegration({ name, accessToken, tokenExpiry, profile, media }) {
  const { userId } = await auth();
  if (!userId) {
    console.error("User not authenticated");
    return { error: "User not authenticated" };
  }

  // const newIntegration = {
  //   userId: userId,
  //   accountId: profile.user_id,
  //   scopedId: profile.id,
  //   name: name,
  //   accessToken: accessToken,
  //   tokenExpiry: new Date(tokenExpiry)
  // }

  const newIntegration = await prisma.integration.create({
    data: {
      userId: userId,
      accountId: profile.user_id,
      scopedId: profile.id,
      name: name,
      accessToken: accessToken,
      tokenExpiry: new Date(tokenExpiry)
    }
  });

  console.log("CREATED INTEGRATION", newIntegration);

  const instagramProfile = await saveInstagramProfile(profile, newIntegration.id);

  console.log("CREATED INSTAGRAM PROFILE", instagramProfile);

  const instagramMedia = await saveInstagramMedia(media, newIntegration.id);
  console.log("CREATED INSTAGRAM MEDIA", instagramMedia);

  return newIntegration;
}

export async function getIntegration(id: string) {
  const integration = await prisma.integration.findUnique({
    where: { id }
  });
  return integration;
}
// Automation Queries
export async function updateAutomation(id: string, automation: Workflow) {
  const updatedAutomation = await prisma.workflow.update({
    where: { id },
    data: automation
  });
  return updatedAutomation;
}
export async function createAutomation(automation: Workflow) {
  const newAutomation = await prisma.workflow.create({
    data: automation
  });
  return newAutomation;
}

export async function getAutomations() {
  const automations = await prisma.workflow.findMany();
  return automations;
}

export async function getAutomation(id: string) {
  const automation = await prisma.workflow.findUnique({
    where: { id }
  });
  return automation;
}
