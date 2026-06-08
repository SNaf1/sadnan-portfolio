import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@portfolio/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, details } = body;

    if (!eventType) {
      return NextResponse.json({ error: "Missing eventType" }, { status: 400 });
    }

    // Retrieve the session ID from cookies
    const sessionId = request.cookies.get("portfolio_session_id")?.value;

    // If session is missing or blocked, skip recording the event to maintain integrity
    if (!sessionId) {
      return NextResponse.json({ success: false, message: "No active session cookie found" });
    }

    // Save event in database
    await prisma.analyticsEvent.create({
      data: {
        sessionId,
        eventType,
        details: details || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging analytics event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
