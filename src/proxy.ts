import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const configuredAdminUrl = process.env.ADMIN_SITE_URL?.trim();

  if (configuredAdminUrl) {
    try {
      const adminUrl = new URL(configuredAdminUrl);
      const requestHost = request.headers.get("host")?.toLowerCase();

      if (requestHost === adminUrl.host.toLowerCase()) {
        if (request.nextUrl.pathname === "/") {
          return NextResponse.rewrite(new URL("/admin", request.url));
        }

        if (!request.nextUrl.pathname.startsWith("/admin")) {
          return NextResponse.redirect(new URL("/", adminUrl));
        }

        return NextResponse.next();
      }
    } catch {
      // Invalid configuration is handled by the server-side admin guard.
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|opengraph-image|admin|.*\\..*).*)",
};
