import {
  getInstagramAccessToken,
  getInstagramMedia,
  getInstagramUserProfile,
  getLongLivedAccessToken,
  InstagramData,
} from "@/lib/instagram";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const redirectTo = state || "/integrations";

  if (!code) {
    return NextResponse.json({ error: "Authorization code is missing" }, { status: 400 });
  }

  try {
    // Step 1: Exchange authorization code for a short-lived access token
    const tokenResponse = await getInstagramAccessToken(code);
    const { access_token: shortLivedToken, user_id } = tokenResponse;

    // Step 2: Exchange the short-lived token for a long-lived token
    // This must be done on the server as it requires the app secret
    const longLivedTokenResponse = await getLongLivedAccessToken(shortLivedToken);
    const longLivedToken = longLivedTokenResponse.access_token;
    console.log("longLivedToken", longLivedToken);
    // Step 3: Fetch user profile and media using the long-lived token
    const profile = await getInstagramUserProfile(longLivedToken, user_id);
    const media = await getInstagramMedia(longLivedToken, user_id);

    const responseData: InstagramData = {
      profile,
      media,
      token: shortLivedToken, // Including for reference, but should not be used
      longLivedToken, // This is what should be used for API calls
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
