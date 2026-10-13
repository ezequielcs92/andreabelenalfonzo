import enMessages from "../../messages/en.json";
import esMessages from "../../messages/es.json";

/**
 * While true, every request is answered with a generic maintenance notice and
 * nothing from the site is served. Set to false and redeploy to bring it back.
 */
export const MAINTENANCE_MODE = false;

const { title, body } = esMessages.maintenance;
const en = enMessages.maintenance;

// Deliberately unbranded: system font and system colors, no site assets.
const maintenanceHtml = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
:root { color-scheme: light dark; }
body { display: grid; min-height: 100vh; margin: 0; padding: 1.5rem; place-items: center; background: Canvas; color: CanvasText; font-family: system-ui, sans-serif; text-align: center; }
h1 { margin: 0 0 .75rem; font-size: 1.5rem; font-weight: 600; }
p { margin: 0; line-height: 1.6; }
p[lang="en"] { margin-top: 1.5rem; opacity: .7; }
</style>
</head>
<body>
<main>
<h1>${title}</h1>
<p>${body}</p>
<p lang="en">${en.title}. ${en.body}</p>
</main>
</body>
</html>
`;

/** 503 tells crawlers the outage is temporary, so they keep what is indexed. */
export function maintenanceResponse() {
  return new Response(maintenanceHtml, {
    status: 503,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Retry-After": "3600",
    },
  });
}
