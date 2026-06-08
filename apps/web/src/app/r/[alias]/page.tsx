import { redirect } from "next/navigation";

/**
 * Fallback — middleware at src/middleware.ts intercepts all /r/* requests
 * before this page ever renders. This is just a safety net.
 */
export default function RedirectPage() {
  redirect("/");
}
