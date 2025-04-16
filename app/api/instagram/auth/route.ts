import { getInstagramAuthUrl } from "@/lib/instagram";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the redirect parameter if present
    const searchParams = request.nextUrl.searchParams;
    const redirectTo = searchParams.get("redirect") || "/integrations";

    // Generate the Instagram auth URL
    const authUrl = getInstagramAuthUrl();

    // Add the redirect parameter to the callback URL
    const redirectUrl = new URL(authUrl);
    redirectUrl.searchParams.append("state", redirectTo);

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Instagram auth error:", error);
    return NextResponse.json({ error: "Failed to generate Instagram auth URL" }, { status: 500 });
  }
}
