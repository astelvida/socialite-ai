import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("hub.mode");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");
  const verifyToken = request.nextUrl.searchParams.get("hub.verify_token");

  console.log("Mode", mode);
  console.log("Challenge", challenge);
  console.log("Verify token", verifyToken);

  if (verifyToken !== process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse("Invalid verify token", { status: 400 });
  }
  return new NextResponse(challenge, { status: 200 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log("Webhook payload", body);
  try {
    const webhook_payload = await request.json();
  } catch (error) {
    console.error(error);
    return new NextResponse("Error", { status: 500 });
  } finally {
    return new NextResponse("Webhook received", { status: 200 });
  }
}
