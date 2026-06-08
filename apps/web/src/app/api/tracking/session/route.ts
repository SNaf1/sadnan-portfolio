import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@portfolio/db";
import { randomUUID } from "crypto";
import { SessionInitRequest } from "@portfolio/types";

export async function POST(request: NextRequest) {
  try {
    const body: SessionInitRequest = await request.json();

    // Read redirect alias cookie set by /r/[alias] — highest-priority source attribution
    const redirectAlias = request.cookies.get("portfolio_redirect_alias")?.value;
    // Merge alias into UTM fields if present (alias wins over any URL params)
    const effectiveUtmSource   = redirectAlias ? "portfolio-link" : body.utmSource;
    const effectiveUtmMedium   = redirectAlias ? "direct"         : body.utmMedium;
    const effectiveUtmCampaign = redirectAlias ?? body.utmCampaign;

    // 1. Resolve Visitor Cookie / Database entry
    let visitorId = request.cookies.get("portfolio_visitor_id")?.value;
    let isNewVisitor = false;

    if (!visitorId) {
      visitorId = randomUUID();
      isNewVisitor = true;
    }

    // Ensure visitor exists in DB
    if (isNewVisitor) {
      await prisma.visitor.create({
        data: {
          id: visitorId,
          firstTouchSource: effectiveUtmSource || parseReferrerSource(body.referrer),
          firstTouchMedium: effectiveUtmMedium || (body.referrer ? "referral" : "direct"),
          firstTouchCampaign: effectiveUtmCampaign,
          firstTouchUrl: body.landingPage,
        },
      });
    }

    // 2. Resolve Session Cookie / Database entry
    let sessionId = request.cookies.get("portfolio_session_id")?.value;
    let isNewSession = false;

    if (!sessionId) {
      sessionId = randomUUID();
      isNewSession = true;
    }

    // Ensure session exists in DB
    if (isNewSession) {
      await prisma.session.create({
        data: {
          id: sessionId,
          visitorId: visitorId,
          lastTouchSource: effectiveUtmSource || parseReferrerSource(body.referrer),
          lastTouchMedium: effectiveUtmMedium || (body.referrer ? "referral" : "direct"),
          referrer: body.referrer,
          landingPage: body.landingPage,
          gclid: body.gclid,
          fbclid: body.fbclid,
          utmSource: effectiveUtmSource,
          utmMedium: effectiveUtmMedium,
          utmCampaign: effectiveUtmCampaign,
          utmContent: body.utmContent,
        },
      });
    }

    // 3. Prepare response with cookies
    const response = NextResponse.json({ visitorId, sessionId });

    // Clear the redirect alias cookie after consuming it — it's one-shot
    if (redirectAlias) {
      response.cookies.set("portfolio_redirect_alias", "", { maxAge: 0, path: "/" });
    }

    // Set visitor cookie (1 year)
    response.cookies.set("portfolio_visitor_id", visitorId, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    // Set session cookie (30 minutes sliding window)
    response.cookies.set("portfolio_session_id", sessionId, {
      maxAge: 60 * 30,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error handling session tracking:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Utility to categorize traffic sources from referrers
function parseReferrerSource(referrer?: string): string {
  if (!referrer) return "direct";
  try {
    const url = new URL(referrer);
    if (url.hostname.includes("linkedin.com")) return "linkedin";
    if (url.hostname.includes("github.com")) return "github";
    if (url.hostname.includes("google.com")) return "google";
    if (url.hostname.includes("t.co") || url.hostname.includes("x.com") || url.hostname.includes("twitter.com")) return "x/twitter";
    return url.hostname; // Default to host name
  } catch {
    return "unknown-referrer";
  }
}
