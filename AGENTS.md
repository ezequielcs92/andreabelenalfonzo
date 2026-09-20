# One page — Andrea Belén Alfonzo (artista circense)

Portfolio one-page bilingüe (ES/EN) para una aerialista y bailarina profesional de Buenos
Aires. Sitio estático con animaciones cinematográficas, pensado como carta de presentación
ante productoras y compañías. Deploy en Vercel.

**Antes de escribir código, leer [`BRIEF.md`](BRIEF.md)** — es la especificación completa
del proyecto. Los textos salen de [`content/andrea.md`](content/andrea.md).

## Stack

- **Next.js 16** (App Router) + TypeScript estricto
- **Tailwind CSS v4** (tokens con `@theme` en `src/app/globals.css`, sin `tailwind.config`)
- **Motion** (`motion/react`) para todas las animaciones — NO instalar GSAP ni otra librería
- **Lenis** para smooth scroll
- **next-intl v4** para el bilingüe (`messages/es.json`, `messages/en.json`, rutas `/es` y `/en`)
- **Poppins** vía `next/font/google`
- **lucide-react** para íconos
- **Cloudflare Images** para imágenes y posters
- **Cloudflare R2** para videos cortos en loop
- **Cloudflare Stream** para reels y videos largos

No hay formulario ni backend general. El sitio público debe poder prerenderizarse entero.
Excepción aprobada: un panel servido desde el subdominio admin y protegido por Cloudflare Access para curar la
galería, que persiste el orden y visibilidad de las 64 imágenes en Cloudflare D1 mediante
REST y token server-only.

**No agregar Supabase, Resend ni ningún servicio con credenciales** salvo la excepción D1
ya documentada: el contacto sigue siendo WhatsApp, email e Instagram.

Los identificadores públicos de Images, R2 y Stream pueden llegar al cliente, pero nunca
guardar tokens de API, claves de acceso ni secretos de Cloudflare en el repositorio o el frontend.
El reproductor de Stream se monta de forma diferida, solo cuando el usuario decide ver el
video.

## Convenciones

- Server Components por defecto; `"use client"` solo donde haga falta (Motion, Lenis,
  lightbox, selector de idioma). El `page.tsx` nunca lleva `"use client"`.
- Componentes en `src/components/` con subcarpetas: `layout/`, `sections/`, `motion/`.
- **Cero strings visibles hardcodeados.** Todo texto sale de `messages/*.json`. `es.json` y
  `en.json` tienen que tener exactamente las mismas claves.
- Todo texto en español rioplatense. Cuando se incorpore contenido nuevo en español,
  generar su traducción al inglés y mantener ambos idiomas sincronizados en
  `content/andrea.md` y `messages/*.json`.
- Colores solo por token (`--color-magenta`, `--color-rosa`, `--color-dorado`,
  `--color-tinta`). Nada de hex sueltos en componentes.
- El dorado es acento: filetes, líneas, hover, bordes. Nunca fondo grande ni texto chico
  sobre blanco (no pasa contraste).
- Mobile-first: tiene que verse perfecto en 375 px.
- Respetar `prefers-reduced-motion` en **todas** las animaciones. Con movimiento reducido,
  Lenis no se inicializa.
- Ninguna animación puede esconder contenido si JS no corre: el texto indexable siempre
  está en el HTML del servidor.
- Solo un `<h1>` en toda la página (el nombre en el hero).
- El dominio es `andreabelenalfonzo.com` y vive únicamente en `NEXT_PUBLIC_SITE_URL`,
  leído desde `src/data/site.ts`. No escribirlo a mano en ningún otro archivo.
- Commits en inglés.

## Comandos

- `npm run dev` — desarrollo
- `npm run build` — build de producción
- `npm run lint` — ESLint

## Material multimedia

Andrea entregó 64 imágenes y 22 videos el 2026-08-29. Las imágenes actuales están en
Cloudflare Images con IDs `andrea-media-001` a `andrea-media-064` más dos reemplazos de
disciplinas (`andrea-media-065` y `andrea-media-066`); los videos están en
Cloudflare Stream y sus UIDs viven en `src/data/videos.ts`. Fotos muestra las 64 imágenes,
Videos muestra los 22 clips y Números completos contiene cuatro enlaces de YouTube. No usar
material de stock.

## Datos a no publicar

El CV viejo de Andrea incluye su peso. **No va al sitio**: no está en la información
actualizada que entregó. La ficha técnica publica altura, cabello, ojos, tez, complexión,
calzado, talle, tatuajes, piercings, idiomas, pasaporte y disponibilidad.

## Memoria compartida

La ficha de este proyecto en la bóveda de Obsidian está en
`D:\Desarrollos\Boveda\01-Proyectos\Andrea Alfonzo - One page\`. Al cerrar una tarea que
cambie decisiones o estado, actualizarla (ver `D:\Desarrollos\Boveda\AGENTS.md`).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
