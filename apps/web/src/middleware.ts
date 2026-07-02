import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SHUTDOWN_PATH = "/goodbye";
const ALLOWED_STATIC_PATHS = new Set([
  "/favicon.ico",
  "/icon.svg",
  "/no-slop-og.png",
  "/peerlist-dark.svg",
  "/peerlist-light.svg",
  "/your_cooked.gif",
  "/robots.txt",
  "/sitemap.xml",
]);
const ICON_PNG_PATH = /^\/icon-\d+\.png$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === SHUTDOWN_PATH ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    ALLOWED_STATIC_PATHS.has(pathname) ||
    ICON_PNG_PATH.test(pathname)
  ) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL(SHUTDOWN_PATH, request.url));
}

export const config = {
  matcher: "/:path*",
};
