import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { MAINTENANCE_MODE, maintenanceResponse } from "./lib/maintenance";

const intlMiddleware = createMiddleware(routing);

// Paths that are served as-is, without locale routing or admin host handling.
const passthroughPath = /^\/(?:api|trpc|_next|_vercel|opengraph-image|admin|.*\..*)/;

export default function proxy(request: NextRequest) {
  if (MAINTENANCE_MODE) return maintenanceResponse();

  if (passthroughPath.test(request.nextUrl.pathname)) return NextResponse.next();

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

// Broad on purpose so maintenance mode also covers the API, the admin panel,
// the OG image and metadata files; passthroughPath narrows it back down.
export const config = {
  matcher: "/((?!_next|_vercel).*)",
};
