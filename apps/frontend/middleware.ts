import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has("sessionid");
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (!hasSession && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasSession && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Excludes /api, Next internals, and any path with a file extension
  // (favicon.ico, /illustrations/*.svg, etc.) so static assets are never
  // caught by the auth redirect.
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
