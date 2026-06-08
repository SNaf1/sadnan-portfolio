import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js 16 proxy (previously called middleware).
 * Intercepts /r/[alias] before any page renders,
 * sets the tracking cookie, and redirects to / with a clean URL.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/r/")) {
    // Extract and sanitise the alias
    const rawAlias = pathname.slice(3); // remove "/r/"
    const safeAlias = rawAlias.replace(/[^a-zA-Z0-9_\-]/g, "").slice(0, 64);

    const redirectUrl = new URL("/", request.url);
    const response = NextResponse.redirect(redirectUrl);

    if (safeAlias) {
      response.cookies.set("portfolio_redirect_alias", safeAlias, {
        maxAge: 60 * 30,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    return response;
  }
}

export const config = {
  matcher: ["/r/:path*"],
};
