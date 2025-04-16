import { getInstagramAuthUrl } from "@/lib/instagram";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }
  try {
    // Get the redirect parameter if present
    const searchParams = request.nextUrl.searchParams;
    const redirectTo = searchParams.get("redirect") || "/dashboard/integrations";

    // Generate the Instagram auth URL
    const authUrl = getInstagramAuthUrl();

    // Add the redirect parameter to the callback URL
    const redirectUrl = new URL(authUrl);
    redirectUrl.searchParams.append("state", redirectTo);
    redirectUrl.searchParams.append("appUserId", userId);

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Instagram auth error:", error);
    return NextResponse.json({ error: "Failed to generate Instagram auth URL" }, { status: 500 });
  }
}
