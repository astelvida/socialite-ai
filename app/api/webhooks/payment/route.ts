import { NextRequest, NextResponse } from "next/server";

// TODO: Implement payment webhook
export async function POST(request: NextRequest) {
  const { amount } = await request.json();
  return NextResponse.json({ amount });
}
