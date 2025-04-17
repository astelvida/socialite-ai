import {
  getInstagramAccessToken,
  getInstagramMedia,
  getInstagramUserProfile,
  getLongLivedAccessToken,
  InstagramData,
} from "@/lib/instagram";
import { createIntegration } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  console.log("GET callback received for user @clerk auth() works?", userId);
  if (!userId) {
    console.error("User not found clerk_userId", userId);
  }
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const appUserId = userId || searchParams.get("appUserId");
  const redirectTo = state || "/dashboard/integrations";

  if (!code) {
    return NextResponse.json({ error: "Authorization code is missing" }, { status: 400 });
  }

  try {
    // Step 1: Exchange authorization code for a short-lived access tokens
    const tokenResponse = await getInstagramAccessToken(code);

    const { access_token: shortLivedToken } = tokenResponse; // user_id is the user id of the instagram account
    console.log("tokenResponse", tokenResponse);

    // Step 2: Exchange the short-lived token for a long-lived token
    // This must be done on the server as it requires the app secret
    const longLivedTokenResponse = await getLongLivedAccessToken(shortLivedToken);

    console.log("longLivedToken", longLivedTokenResponse);

    const { access_token: longLivedToken, expires_in } = longLivedTokenResponse;

    // Step 3: Fetch user profile and media using the long-lived token
    const profile = await getInstagramUserProfile(longLivedToken);

    const media = await getInstagramMedia(longLivedToken);

    // prisma

    if (!appUserId) {
      console.error("User not found appUserId", appUserId);
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }
    const tokenExpiry = Date.now() + expires_in * 1000;

    const integration = await createIntegration({
      name: "INSTAGRAM",
      accessToken: longLivedToken,
      tokenExpiry,
      profile,
      media,
    });

    console.log("CREATED INTEGRATION WITH PROFILE AND MEDIA", integration);

    // await storeToken(appUserId, {
    //   token: longLivedToken,
    //   tokenExpires: Date.now() + Number(expires_in) * 1000,
    // });

    // await storeUserSession(appUserId, { profile, media });

    const responseData: InstagramData = {
      profile,
      media,
      token: shortLivedToken, // Including for reference, but should not be used
      longLivedToken, // This is what should be used for API calls
      expires_in,
    };

    // Redirect to the Instagram page with data in query params
    // The frontend will extract this data and store it in localStorage
    const redirectUrl = new URL(redirectTo, request.nextUrl.origin);
    redirectUrl.searchParams.set("instagram_data", JSON.stringify(responseData));

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Instagram callback error:", error);
    // Redirect with error
    const redirectUrl = new URL(redirectTo, request.nextUrl.origin);
    redirectUrl.searchParams.set(
      "instagram_error",
      error instanceof Error ? error.message : "Failed to process Instagram authentication"
    );

    return NextResponse.redirect(redirectUrl);
  }
}
