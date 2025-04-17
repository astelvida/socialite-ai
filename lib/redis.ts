"use server";

import { Redis } from "@upstash/redis";
import type { InstagramMedia } from "./instagram";

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const CACHE_TTL = 60 * 60; // 1 hour in seconds
const MEDIA_CACHE_PREFIX = "instagram:media:";
const PROFILE_CACHE_PREFIX = "instagram:profile:";

export async function cacheInstagramMedia(userId: string, media: InstagramMedia[]) {
  const key = `${MEDIA_CACHE_PREFIX}${userId}`;
  await redis.set(key, JSON.stringify(media), {
    ex: CACHE_TTL,
  });
}

export async function getCachedInstagramMedia(userId: string): Promise<InstagramMedia[] | null> {
  const key = `${MEDIA_CACHE_PREFIX}${userId}`;
  const cachedData = await redis.get<string>(key);

  if (!cachedData) {
    return null;
  }

  try {
    return JSON.parse(cachedData) as InstagramMedia[];
  } catch (err) {
    console.error("Error parsing cached Instagram media:", err);
    return null;
  }
}

export async function invalidateInstagramCache(userId: string) {
  const mediaKey = `${MEDIA_CACHE_PREFIX}${userId}`;
  const profileKey = `${PROFILE_CACHE_PREFIX}${userId}`;

  await Promise.all([redis.del(mediaKey), redis.del(profileKey)]);
}

// Helper function to generate cache key for filtered media
export async function getFilteredMediaCacheKey(
  userId: string,
  options: { limit?: number; username?: string }
) {
  const { limit, username } = options;
  return `${MEDIA_CACHE_PREFIX}${userId}:filtered:${limit || "all"}:${username || "all"}`;
}

// Cache filtered media results
export async function cacheFilteredInstagramMedia(
  userId: string,
  media: InstagramMedia[],
  options: { limit?: number; username?: string }
) {
  const key = getFilteredMediaCacheKey(userId, options);
  await redis.set(key, JSON.stringify(media), {
    ex: CACHE_TTL,
  });
}

// Get cached filtered media
export async function getCachedFilteredInstagramMedia(
  userId: string,
  options: { limit?: number; username?: string }
): Promise<InstagramMedia[] | null> {
  const key = getFilteredMediaCacheKey(userId, options);
  const cachedData = await redis.get<string>(key);

  console.log("cachedData", cachedData);
  if (!cachedData) {
    return null;
  }

  try {
    return JSON.parse(cachedData) as InstagramMedia[];
  } catch (err) {
    console.error("Error parsing cached filtered Instagram media:", err);
    return null;
  }
}
