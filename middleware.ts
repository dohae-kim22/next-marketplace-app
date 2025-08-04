import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { getSession } from "./lib/session";

const publicOnlyUrls = [
  "/",
  "/login",
  "/sms",
  "/create-account",
  "/api/github/start",
  "/api/github/complete",
  "/api/google/start",
  "/api/google/complete",
];

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const intlResponse = await intlMiddleware(request);

  const pathname = request.nextUrl.pathname.replace(/^\/(en|fr)/, "") || "/";
  const isPublic = publicOnlyUrls.includes(pathname);

  const session = await getSession();

  if (!session.id && !isPublic) {
    return NextResponse.redirect(
      new URL(`/${request.nextUrl.locale || "fr"}`, request.url)
    );
  }

  if (session.id && isPublic) {
    return NextResponse.redirect(
      new URL(`/${request.nextUrl.locale || "fr"}/products`, request.url)
    );
  }

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
