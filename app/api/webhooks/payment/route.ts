import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { amount } = await request.json()
  return NextResponse.json({ amount })
}
