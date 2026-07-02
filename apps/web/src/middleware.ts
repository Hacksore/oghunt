import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SHUTDOWN_PATH = "/goodbye";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === SHUTDOWN_PATH ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL(SHUTDOWN_PATH, request.url));
}

export const config = {
  matcher: "/:path*",
};
