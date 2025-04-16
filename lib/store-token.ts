"use server";

import { refreshLongLivedToken } from "@/lib/instagram";
import { Redis } from "@upstash/redis";

console.log(`UPSTASH_REDIS_REST_URL = ${process.env.UPSTASH_REDIS_REST_URL}`);
console.log(`UPSTASH_REDIS_REST_TOKEN = ${process.env.UPSTASH_REDIS_REST_TOKEN}`);
console.assert(
  process.env.UPSTASH_REDIS_REST_URL !== undefined,
  "UPSTASH_REDIS_REST_URL is not set"
);
console.assert(
  process.env.UPSTASH_REDIS_REST_TOKEN !== undefined,
  "UPSTASH_REDIS_REST_TOKEN is not set"
);

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

redis.keys("*").then((keys) => {
  console.log("keys", keys);
});

type TokenData = {
  token: string;
  tokenExpires: number;
};

type UserProfile = {
  profile: any;
  media: any;
};

export async function storeUserSession(userId: string, userProfile: UserProfile) {
  const userProfileString = JSON.stringify(userProfile);
  const rawResponse = await redis.set(`userSession:${userId}`, userProfileString);
  return rawResponse;
}

export async function getUserSession(userId: string): Promise<UserProfile | null> {
  const userSession = await redis.get(`userSession:${userId}`);
  return userSession;
}

export async function storeToken(userId: string, tokenData: TokenData) {
  const tokenDataString = JSON.stringify(tokenData);
  const rawResponse = await redis.set(`token:${userId}`, tokenDataString);
  return rawResponse;
}

export async function getToken(userId: string): Promise<TokenData | null> {
  const tokenData = await redis.get(`token:${userId}`);
  return tokenData;
}

export async function checkTokenExpiration(userId: string, tokenData: TokenData) {
  // Check if token is near expiration (less than 5 days remaining)
  const now = Date.now();
  const expiresAt = tokenData.tokenExpires || 0;
  const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;

  // If token expires in less than 5 days and is at least 24 hours old, refresh it
  if (expiresAt - now < fiveDaysInMs && expiresAt > 0) {
    try {
      // Token must be at least 24 hours old to refresh
      const tokenTimestamp = expiresAt - 60 * 24 * 60 * 60 * 1000;
      const tokenAgeInMs = now - tokenTimestamp;
      const oneDayInMs = 24 * 60 * 60 * 1000;

      if (tokenAgeInMs >= oneDayInMs) {
        console.log("Refreshing Instagram token...");
        const refreshedToken = await refreshLongLivedToken(tokenData.token);

        // Update the tokenData with new token and expiration
        const updatedTokenData = {
          token: refreshedToken.access_token,
          tokenExpires: now + refreshedToken.expires_in * 1000,
        };

        storeToken(userId, updatedTokenData);
      }
    } catch (err) {
      console.error("Failed to refresh Instagram token:", err);
      // Still use the existing token even if refresh failed
    }
  }
}

export async function checkAndRefreshToken(userId: string) {
  const tokenData = await getToken(userId);
  await checkTokenExpiration(userId, tokenData);
}
