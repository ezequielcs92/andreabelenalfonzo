import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { MAINTENANCE_MODE, maintenanceResponse } from "./lib/maintenance";

const intlMiddleware = createMiddleware(routing);

const ESTADO_URL = "https://cobros-clientes.vercel.app/api/estado/160ada4bdfb16ce9d08afbaa5f7e4561ce24";

async function sitioEnMantenimiento() {
  try {
    const res = await fetch(ESTADO_URL, { signal: AbortSignal.timeout(1500) });
    if (!res.ok) return null;
    const estado = await res.json();
    return estado.mantenimiento ? estado.html : null;
  } catch {
    return null; // Si la app de cobros no responde, el sitio sigue en línea.
  }
}

function paginaMantenimiento(html: string) {
  return new Response(html, {
    status: 503,
    headers: { "content-type": "text/html; charset=utf-8", "retry-after": "3600", "cache-control": "no-store" },
  });
}

// Static files and internal routes skip the remote maintenance check.
const sinConsultaRemota = /^\/(?:_next|api)\/|\.(?:png|jpg|jpeg|gif|svg|webp|avif|ico|css|js|mjs|map|woff|woff2|ttf|txt|xml|json)$/i;

// Paths that are served as-is, without locale routing or admin host handling.
const passthroughPath = /^\/(?:api|trpc|_next|_vercel|opengraph-image|admin|.*\..*)/;

export default async function proxy(request: NextRequest) {
  if (!sinConsultaRemota.test(request.nextUrl.pathname)) {
    const html = await sitioEnMantenimiento();
    if (html) return paginaMantenimiento(html);
  }

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
