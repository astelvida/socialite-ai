import { url } from "inspector";

interface InstagramTokenResponse {
  access_token: string;
  user_id: string;
}

interface InstagramLongLivedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface InstagramUserProfile {
  id: string;
  username: string;
}

interface InstagramMedia {
  id: string;
  caption?: string;
  media_type: string;
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
  username: string;
}

export interface InstagramData {
  profile?: InstagramUserProfile;
  media?: InstagramMedia[];
  error?: string;
  token?: string;
  longLivedToken?: string;
}

/**
 * Get the Instagram login URL with updated scope values per documentation
 */
export const getInstagramAuthUrl = (): string => {
  const appId = process.env.INSTAGRAM_APP_ID;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;

  if (!appId || !redirectUri) {
    throw new Error("Instagram credentials not configured");
  }

  // Using new scope values as per documentation
  const scopes = [
    "instagram_business_basic",
    "instagram_business_content_publish",
    "instagram_business_manage_comments",
    "instagram_business_manage_messages",
  ].join(",");
  console.log("scopes", scopes);

  return `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${appId}&redirect_uri=${encodeURI(
    redirectUri
  )}&scope=${encodeURIComponent(scopes)}&response_type=code`;
};

/**
 * Exchange authorization code for a short-lived access token
 * As per documentation: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login/
 */
export const getInstagramAccessToken = async (code: string): Promise<InstagramTokenResponse> => {
  const appId = process.env.INSTAGRAM_APP_ID;
  const appSecret = process.env.INSTAGRAM_APP_SECRET;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;

  if (!appId || !appSecret || !redirectUri) {
    throw new Error("Instagram credentials not configured");
  }

  const params = new URLSearchParams({
    client_id: appId,
    client_secret: appSecret,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code,
  });

  const response = await fetch(`https://api.instagram.com/oauth/access_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get access token: ${JSON.stringify(error)}`);
  }

  // Parse the response which contains short-lived token
  const tokenData = await response.json();
  console.log("tokenData", tokenData);
  return {
    access_token: tokenData.access_token,
    user_id: tokenData.user_id,
  };
};

/**
 * Exchange a short-lived token for a long-lived token
 * As per documentation: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login/
 */
export const getLongLivedAccessToken = async (
  shortLivedToken: string
): Promise<InstagramLongLivedTokenResponse> => {
  const appSecret = process.env.INSTAGRAM_APP_SECRET;

  if (!appSecret) {
    throw new Error("Instagram app secret not configured");
  }

  const response = await fetch(
    `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortLivedToken}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get long-lived token: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  console.log("data", data);
  return data;
};

/**
 * Refresh a long-lived token
 * As per documentation: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login/
 */
export const refreshLongLivedToken = async (
  longLivedToken: string
): Promise<InstagramLongLivedTokenResponse> => {
  const response = await fetch(
    `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${longLivedToken}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to refresh token: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  console.log("data", data);
  return data;
};

/**
 * Get the Instagram user profile
 * Using v22.0 as specified in the documentation
 */
export const getInstagramUserProfile = async (
  accessToken: string,
  userId: string
): Promise<InstagramUserProfile> => {
  const url = `https://graph.instagram.com/v22.0/me?fields=id,username,user_id&access_token=${accessToken}`;
  console.log("url", url);
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get user profile: ${JSON.stringify(error)}`);
  }

  return response.json();
};

/**
 * Get Instagram media
 * Using v22.0 as specified in the documentation
 */
export const getInstagramMedia = async (
  accessToken: string,
  userId: string
): Promise<InstagramMedia[]> => {
  const url = `https://graph.instagram.com/v22.0/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=${accessToken}`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get media: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.data;
};
