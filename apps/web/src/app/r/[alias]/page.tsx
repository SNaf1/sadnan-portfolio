import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

interface RedirectPageProps {
  params: Promise<{ alias: string }>;
}

/**
 * /r/[alias] — Clean recruiter tracking redirect.
 *
 * When a recruiter visits e.g. /r/john-doe, we:
 *  1. Store the alias in a short-lived cookie (portfolio_redirect_alias)
 *  2. Immediately redirect to / with NO visible URL parameters
 *
 * The session tracking endpoint (/api/tracking/session) picks up the alias
 * cookie and records it as the utmCampaign so you know exactly which
 * outreach link brought each visitor — without ugly ?utm_* params.
 */
export default async function RedirectPage({ params }: RedirectPageProps) {
  const { alias } = await params;

  // Sanitise the alias — only allow URL-safe characters
  const safeAlias = alias.replace(/[^a-zA-Z0-9_\-]/g, "").slice(0, 64);

  if (!safeAlias) {
    redirect("/");
  }

  // Set the redirect alias cookie — 30 minutes, httpOnly
  const cookieStore = await cookies();
  cookieStore.set("portfolio_redirect_alias", safeAlias, {
    maxAge: 60 * 30,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  // Hard redirect to homepage — no UTM params visible in the URL
  redirect("/");
}
