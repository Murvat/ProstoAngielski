import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const courseId = new URL(req.url).searchParams.get("courseId");

  if (!courseId) {
    return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
  }

  return NextResponse.json({
    hasAccess: true,
    hasPaidPurchase: false,
    hasActiveSubscription: false,
  });
}
