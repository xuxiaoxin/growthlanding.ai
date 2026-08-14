/**
 * GET /api/me — lightweight login-state probe for the Header <AccountMenu/>.
 *
 * The session cookie is httpOnly, so a client component cannot read it
 * directly. This endpoint calls `auth()` server-side and returns only the
 * non-sensitive fields needed to render the account entry (name + image). It
 * deliberately omits the email address.
 *
 * Dynamic endpoint (ƒ), confined to /api/* — does not touch the SSG SEO pages.
 */
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ authed: false });
  return NextResponse.json({
    authed: true,
    name: session.user.name ?? null,
    image: session.user.image ?? null,
  });
}
