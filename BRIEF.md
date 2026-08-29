# BRIEF — One page de Andrea Belén Alfonzo

> Documento de trabajo para desarrollar el sitio con Codex. Contiene todo lo necesario
> para construirlo de punta a punta: stack, identidad visual, estructura, animaciones,
> bilingüe, SEO y criterios de aceptación. Los textos salen de
> [`content/andrea.md`](content/andrea.md) — **no escribir copy nuevo**.
>
> Creado: 2026-08-28.

---

## 1. Qué se construye

Una **one page** de portfolio profesional para Andrea Belén Alfonzo, artista circense
(aerialista y bailarina) radicada en Buenos Aires. El sitio es su carta de presentación
ante productoras, circos y compañías nacionales e internacionales, y reemplaza al CV en
PDF que hoy manda por WhatsApp.

Tiene que lograr tres cosas al mismo tiempo:

1. **Impresionar** — animaciones cinematográficas, sensación de portfolio de alta gama.
2. **Convencer** — que un director de casting encuentre en 30 segundos lo que necesita:
   disciplinas, experiencia, ficha técnica y cómo contactarla.
3. **Aparecer en Google** — por su nombre y por búsquedas del rubro, en español e inglés.

### Restricciones

| Tema | Decisión tomada |
| --- | --- |
| Idiomas | Español (default) e inglés, en rutas separadas `/es` y `/en` |
| Material visual | **Todavía no hay fotos ni video.** Se construye con placeholders y estructura lista para reemplazar sin tocar código |
| Infraestructura multimedia | Cloudflare Images para fotos, R2 para loops y Stream para videos largos |
| Contacto | WhatsApp + email + Instagram. **Sin formulario, sin backend, sin secretos** |
| Hosting | Vercel, dominio **andreabelenalfonzo.com** → siempre leído desde `NEXT_PUBLIC_SITE_URL` |
| Repositorio | `https://github.com/ezequielcs92/andreabelenalfonzo.git` |
| Animación | Cinematográfica y elegante. **No juguetona**: nada de confetti, cursores raros ni micro-juegos |
| Fuera de alcance | Formulario, CMS, panel de administración, blog, descarga de CV en PDF |

---

## 2. Stack

Fijado para coincidir con los otros proyectos de `D:\Desarrollos` (`Locutora`,
`Manish agencia`, `fertilitycentercancun-master`). No cambiarlo sin avisar.

| Pieza | Elección |
| --- | --- |
| Framework | Next.js 16, App Router, TypeScript estricto |
| React | 19 |
| Estilos | Tailwind v4 (`@tailwindcss/postcss`, config en CSS con `@theme`) |
| Animación | `motion` v12 (el paquete actual de Framer Motion — importar de `motion/react`) |
| Scroll | `lenis` |
| i18n | `next-intl` v4 |
| Fuente | Poppins vía `next/font/google` |
| Íconos | `lucide-react` |
| Imágenes | Cloudflare Images con variantes responsive |
| Videos cortos en loop | Cloudflare R2 con dominio público de medios |
| Videos largos | Cloudflare Stream con reproducción adaptativa |
| Deploy | Vercel |

Sin Supabase, sin Resend, sin base de datos. El sitio es estático: todas las rutas deben
poder prerenderizarse.

### Scaffolding

```bash
npx create-next-app@latest . --ts --app --tailwind --eslint --src-dir --no-import-alias
```

Luego:

```bash
npm i motion lenis next-intl lucide-react
```

---

## 3. Identidad visual

Los colores salen del CV real de Andrea (magenta y rosa sobre blanco) más el dorado que
pidió el cliente. Definirlos como tokens en `src/app/globals.css` con `@theme` de
Tailwind v4 y **usar siempre el token**, nunca un hex suelto en un componente.

```css
@theme {
  --color-magenta: #9C1458;      /* títulos, marca, elementos fuertes */
  --color-magenta-oscuro: #6E0D3E; /* hover de magenta, fondos profundos */
  --color-rosa: #F9C8DE;         /* bloques y barras de sección */
  --color-rosa-suave: #FDEEF5;   /* fondos amplios */
  --color-dorado: #C9A227;       /* acentos, líneas, hover, detalles */
  --color-dorado-claro: #E8D9A0; /* degradés y brillos del dorado */
  --color-tinta: #2B1A22;        /* texto largo */
  --color-blanco: #FFFFFF;
}
```

**Reglas de uso, no negociables:**

- El **dorado es acento**: filetes, subrayados, líneas del timeline, hover, números,
  bordes finos. Nunca un fondo grande ni un párrafo entero.
- El **magenta** manda en títulos y en la marca. El texto largo va en tinta, no en
  magenta (contraste y fatiga visual).
- El **rosa** es fondo, nunca texto.
- Ritmo de secciones: alternar `blanco` → `rosa-suave` → `blanco` para que el scroll
  respire. Un solo bloque en `magenta-oscuro` (el contacto) como cierre.
- Contraste mínimo AA en todo texto. Dorado sobre blanco **no pasa** para texto chico:
  usarlo solo en elementos gráficos o en texto grande sobre fondo oscuro.

### Tipografía

Poppins, cargada con `next/font/google`:

```ts
import { Poppins } from "next/font/google";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "800"],
  display: "swap",
  variable: "--font-poppins",
});
```

- Títulos de sección: 800, mayúsculas, `tracking` amplio (como el CV).
- Nombre en el hero: 800, tamaño fluido con `clamp()`, de 3rem a 9rem.
- Texto: 300/400, `line-height` 1.7, ancho máximo de 65ch.
- Etiquetas y datos de ficha técnica: 600, mayúsculas, tamaño chico, `letter-spacing`.

---

## 4. Estructura de archivos

```
src/
  app/
    [locale]/
      layout.tsx          # html/body, fuente, NextIntlClientProvider, JSON-LD
      page.tsx            # la one page: importa todas las secciones en orden
    globals.css
    robots.ts
    sitemap.ts
    opengraph-image.tsx
  components/
    layout/
      Header.tsx          # nav flotante + selector de idioma
      Footer.tsx
      SmoothScroll.tsx    # provider de Lenis
    sections/
      Hero.tsx
      About.tsx
      Disciplines.tsx
      Experience.tsx
      Training.tsx
      Gallery.tsx
      FullActs.tsx
      Specs.tsx
      Contact.tsx
    motion/
      Reveal.tsx          # wrapper reutilizable de entrada por viewport
      SplitText.tsx       # texto que se compone palabra por palabra
      Parallax.tsx        # wrapper de parallax por scroll
  data/
    site.ts               # SITE_URL, contacto, enlaces, constantes
    experience.ts         # datos de experiencia, con claves de traducción
    disciplines.ts
    fullActs.ts            # IDs de YouTube de los números completos
  i18n/
    routing.ts
    request.ts
  lib/
    jsonld.ts
messages/
  es.json
  en.json
public/
  media/
    README.md             # qué archivo va en cada lugar
content/
  andrea.md               # fuente de todos los textos
```

---

## 5. Secciones

Una sola página por idioma. Orden, contenido y comportamiento:

### 5.1 Header

Nav flotante que aparece recién después de pasar el hero (`useScroll` → mostrar cuando
el progreso supera la altura de la ventana). Contiene los anclajes a las secciones y el
selector **ES / EN**.

El selector cambia de locale **conservando la sección actual**: usar el `Link` de
`next-intl/navigation` hacia el mismo pathname con el otro locale y reponer el hash.

En mobile: menú fullscreen que entra con un `clip-path` o una cortina, no un dropdown.

### 5.2 Hero

- Nombre completo como único `<h1>` de la página.
- Tagline: "Aerialista y bailarina" / "Aerialist and dancer".
- Ubicación y disponibilidad en una línea fina con separadores.
- Fondo: video (placeholder) con `poster`, overlay en degradé magenta→transparente para
  garantizar contraste. Si no hay video todavía, imagen `next/image` con `priority`.
- Dos CTA: **Contratar** (ancla a contacto) y **Ver trabajo** (ancla a galería).
- Un indicador de scroll discreto abajo, en dorado.

### 5.3 Sobre mí

Retrato a un lado (placeholder, con parallax suave) y la declaración artística larga de
`content/andrea.md` al otro. En mobile, retrato arriba y texto abajo.

### 5.4 Disciplinas

Cuatro especialidades principales — suspensión capilar, lira aérea, cintas gota, tela
aérea — como cards grandes con su descripción corta. Debajo, una línea de texto sobre
las otras disciplinas y la formación complementaria.

Las cards son el punto fuerte visual de la sección: borde dorado fino que se traza al
entrar, y en hover una elevación mínima con la imagen que hace un zoom lento.

### 5.5 Experiencia

Timeline vertical con los **siete** trabajos confirmados de
`content/andrea.md` §5, más reciente primero:

1. **Circo Morsicomics** — Argentina · Jul 2026 – Ago 2026 · Artista circense /
   Aerialista – Solista
2. **Cirque XXI 360** — San Carlos de Bariloche, Río Negro · Sep 2025 – Mar 2026 ·
   Bailarina / Aerialista
3. **Circo Arlequín** — Argentina · Jun 2025 – Ago 2025 · Artista circense / Aerialista
   – Solista
4. **INOVACIRCO** — Buenos Aires · 5 de abril de 2025 · Artista circense / Aerialista
5. **Talkkin Silja Symphony — Crucero** — Finlandia y Suecia · Dic 2024 – Mar 2025 ·
   Aerialista
6. **Compañía Turnoc** — Buenos Aires · 2021 – 2023 · Artista circense / Aerialista /
   Bailarina. Incluye las producciones *Hasta la Raíz*, *Cabaret* y *Trabajadores Lunares*.
7. **Edén — Lo salvaje de la naturaleza** — Teatro Metropolitan, Buenos Aires · 2021 ·
   Bailarina / Intérprete

Cada entrada: compañía, lugar, período, rol, una línea de resumen y los bullets. El
crucero merece un tratamiento visual algo más destacado: es la credencial internacional.

Es la sección que más pesa ante una productora: no comprimirla ni esconderla en un
acordeón.

> Lo que figura en el CV viejo y **no** va al sitio (Circo Dacktari) está guardado en
> `content/andrea.md` §5.8. No agregarlo por iniciativa propia.

### 5.6 Formación y workshops

Dos columnas: formación titulada a la izquierda, workshops como chips a la derecha.
Fondo `rosa-suave`.

### 5.7 Galería

Grilla asimétrica de 6 a 9 espacios para fotos, más un espacio destacado para el reel.
Todo con placeholders y `next/image` ya configurado (`fill` + `sizes` correctos).

El reel se aloja en **Cloudflare Stream**. Mostrar primero su poster estático y montar el
player responsive recién cuando el usuario elige reproducirlo; el iframe o player no forma
parte de la carga inicial. Sin autoplay con sonido, nunca.

Click en una foto abre un lightbox simple con `AnimatePresence` y `layoutId` (transición
compartida entre la miniatura y la vista grande). Cerrar con Esc, click afuera y botón.
Bloquear el scroll del body mientras está abierto y devolver el foco al abrir/cerrar.

### 5.8 Números completos

Sección independiente de la galería y de los reels. Presenta números completos alojados
siempre en **YouTube** mediante tarjetas con miniatura. Al hacer click, abre un modal
responsive y accesible con el reproductor de `youtube-nocookie.com`. El iframe se monta
recién cuando el usuario decide reproducir un número: YouTube no forma parte de la carga
inicial. Cerrar con Esc, click afuera y botón; bloquear el scroll mientras está abierto y
devolver el foco al disparador al cerrar.

Los IDs se centralizan en `src/data/fullActs.ts` y los títulos bilingües en
`messages/*.json`. No confundir este contenido con el reel destacado de la galería.

### 5.9 Ficha técnica

Tabla o grilla de datos de casting, con las claves en 600 mayúsculas y los valores en
400. Estética limpia y densa, tipo hoja técnica. **No incluir el peso.**

### 5.10 Contacto

Bloque de cierre en `magenta-oscuro`. Titular grande, la línea de disponibilidad, y tres
botones grandes:

- WhatsApp → `https://wa.me/5491122449236?text=<mensaje pre-cargado por idioma>`
- Email → `mailto:andreabelenalfonzo1@gmail.com`
- Instagram → `https://instagram.com/andreabelenalfonzoo` (con `rel="me noopener"`)

Todos los enlaces externos con `target="_blank" rel="noopener noreferrer"`.

---

## 6. Animaciones

El pedido es "muchas animaciones y diversión, pero muy profesional". La lectura correcta:
**movimiento constante y fluido, cero estridencia**. Todo con `motion/react`.

### Reglas globales

- Curva por defecto: `ease: [0.22, 1, 0.36, 1]` (salida suave, sensación premium).
- Duración de entradas: 0.6–0.9 s. Micro-interacciones: 0.2–0.3 s.
- Distancias de desplazamiento cortas: 16–32 px. Nada de elementos que cruzan la pantalla.
- Todo lo que entra por viewport usa `whileInView` con `viewport={{ once: true, margin: "-15%" }}`.
- Stagger entre hijos: 0.06–0.1 s.
- **Nunca** animar `width`, `height`, `top` o `left`. Solo `transform` y `opacity`.

### Catálogo

| # | Dónde | Qué hace | Cómo |
| --- | --- | --- | --- |
| 1 | Global | Scroll suave | Lenis en un provider cliente, con `requestAnimationFrame`; destruir en el cleanup |
| 2 | Hero | El nombre se compone palabra por palabra | `SplitText` con stagger; el `<h1>` real queda en el DOM completo (ver accesibilidad) |
| 3 | Hero | Fondo con parallax y el contenido que se desvanece al scrollear | `useScroll` sobre la sección + `useTransform` a `y` y `opacity` |
| 4 | Global | Barra de progreso de lectura en dorado, arriba | `useScroll().scrollYProgress` → `scaleX` con `motion.div` |
| 5 | Todas | Reveal por capas con stagger | Componente `Reveal` reutilizable |
| 6 | Títulos de sección | Filete dorado que se dibuja de izquierda a derecha | `scaleX` de 0 a 1 con `transformOrigin: left` |
| 7 | Disciplinas | Borde dorado que se traza en el contorno de la card | SVG `rect` con `pathLength` animado al entrar |
| 8 | Disciplinas | Zoom lento de la imagen en hover | `whileHover={{ scale: 1.04 }}` con transición larga |
| 9 | Experiencia | Línea vertical dorada que se dibuja siguiendo el scroll | `useScroll` de la sección → `scaleY` de la línea; los puntos se encienden al pasar |
| 10 | Formación | Chips que entran en cascada | Stagger corto sobre la lista |
| 11 | Galería | Transición compartida miniatura → lightbox | `layoutId` + `AnimatePresence` |
| 12 | Números completos | Tarjetas que entran en cascada y modal con fundido | `whileInView` + `AnimatePresence` |
| 13 | Ficha técnica | Números y valores que suben en cascada | Reveal con stagger por fila |
| 14 | Contacto | Botones con relleno que barre desde el borde en hover | Pseudo-elemento con `scaleX`, o `motion` con `originX` |
| 14 | Header | El nav aparece/desaparece según dirección de scroll | Comparar el valor previo de `scrollY` con `useMotionValueEvent` |

### Movimiento reducido — obligatorio

```ts
const reduce = useReducedMotion();
```

Con `prefers-reduced-motion: reduce`:

- Nada de parallax, nada de `SplitText` animado, nada de barra de progreso.
- Los reveals se reducen a un fade de 0.2 s o se desactivan por completo.
- Lenis **no se inicializa**: scroll nativo.
- El sitio tiene que quedar perfectamente usable y legible.

### Regla de contenido — obligatorio

Ninguna animación puede esconder contenido si JavaScript no corre. En la práctica:

- El texto indexable existe en el HTML del servidor, siempre.
- Los estados iniciales con `opacity: 0` van **solo** en componentes cliente que Next
  hidrata; verificar con `curl` que el texto aparece en el HTML crudo (ver §10).
- Si un elemento no se ve sin JS, está mal implementado.

---

## 7. Bilingüe (next-intl)

Calcar el patrón que ya funciona en `D:\Desarrollos\fertilitycentercancun-master`.

`src/i18n/routing.ts`:

```ts
import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
});

export type AppLocale = (typeof routing.locales)[number];

export function isValidLocale(value: unknown): value is AppLocale {
  return typeof value === "string" && (routing.locales as readonly string[]).includes(value);
}

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

`src/i18n/request.ts`: `getRequestConfig` que valida el locale y carga
`../../messages/${locale}.json`, exactamente como en el proyecto de referencia.

**Reglas:**

- Cero strings visibles hardcodeados en componentes. Todo sale de `messages/*.json`.
- Las traducciones existentes están escritas en `content/andrea.md`. Ante contenido nuevo
  en español, generar automáticamente la versión inglesa y mantener ambos idiomas
  sincronizados.
- Estructura de las claves espejada por sección: `hero.*`, `about.*`, `disciplines.*`,
  `experience.*`, `training.*`, `gallery.*`, `specs.*`, `contact.*`, `nav.*`, `meta.*`.
- Los datos con estructura (experiencia, disciplinas) viven en `src/data/*.ts` con una
  clave de traducción por campo de texto; los valores neutros (año, lugar) van directo.
- `es.json` y `en.json` tienen que tener **exactamente las mismas claves**.

---

## 8. SEO

Esta parte es un requisito explícito del cliente: el sitio tiene que estar listo para
posicionar. Nada de esto es opcional.

### 8.1 URL base

`src/data/site.ts`:

```ts
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://andreabelenalfonzo.com";
```

El dominio es **andreabelenalfonzo.com** y este es el **único** lugar donde aparece
escrito. En Vercel se define `NEXT_PUBLIC_SITE_URL` con ese valor; en local se puede
apuntar a `http://localhost:3000` con `.env.local`. Dejar `.env.example` con la variable
documentada. Nunca escribir el dominio a mano en otro archivo.

### 8.2 Metadata por idioma

`generateMetadata` en `src/app/[locale]/layout.tsx`:

- `metadataBase: new URL(SITE_URL)`
- `title`:
  - ES: `Andrea Alfonzo — Aerialista y bailarina | Suspensión capilar, lira y tela aérea`
  - EN: `Andrea Alfonzo — Aerialist and dancer | Hair hanging, aerial lyra and silks`
- `description` (150–160 caracteres, con nombre + disciplinas + ubicación + disponibilidad).
- `keywords`: aerialista, suspensión capilar, hair hanging, lira aérea, tela aérea,
  cintas gota, artista circense Buenos Aires, bailarina y acróbata aérea, aerial artist
  Argentina, aerialist for hire.
- `alternates`:
  ```ts
  alternates: {
    canonical: `${SITE_URL}/${locale}`,
    languages: {
      es: `${SITE_URL}/es`,
      en: `${SITE_URL}/en`,
      "x-default": `${SITE_URL}/es`,
    },
  }
  ```
- `openGraph`: type `profile`, `locale` correcto (`es_AR` / `en_US`), `alternateLocale`,
  `url`, `siteName`, y la imagen OG.
- `twitter`: `summary_large_image`.

### 8.3 Archivos de indexación

- `src/app/sitemap.ts` — las dos URLs con `alternates.languages`, siguiendo el patrón de
  `D:\Desarrollos\Locutora\app\sitemap.ts`.
- `src/app/robots.ts` — permitir todo, apuntar al sitemap con `SITE_URL`.
- `src/app/opengraph-image.tsx` — generada con `next/og` (`ImageResponse`, 1200×630) con
  el nombre, el rol y la paleta rosa/dorado. Es lo que se ve al pegar el link en WhatsApp
  e Instagram: importa más que casi cualquier otra cosa acá.

### 8.4 Datos estructurados

`src/lib/jsonld.ts` que genere un `Person` inyectado con
`<script type="application/ld+json">` en el layout:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Andrea Belén Alfonzo",
  "alternateName": "Andrea Alfonzo",
  "jobTitle": "Aerialista y bailarina",
  "description": "...",
  "url": "SITE_URL",
  "image": "SITE_URL/media/og.jpg",
  "nationality": "Argentina",
  "address": { "@type": "PostalAddress", "addressLocality": "Buenos Aires", "addressCountry": "AR" },
  "knowsLanguage": ["es", "en"],
  "knowsAbout": ["Hair hanging", "Aerial lyra", "Aerial silks", "Aerial drop straps", "Dance"],
  "sameAs": ["https://instagram.com/andreabelenalfonzoo"]
}
```

Sumar un `ProfilePage` como `mainEntity` del `Person`. Validar que no tire errores en el
Rich Results Test antes de dar por cerrada la tarea.

### 8.5 Fundamentos

- Un solo `<h1>` en toda la página (el nombre en el hero). Las secciones usan `<h2>`.
- `<html lang>` correcto por locale.
- Landmarks reales: `<header>`, `<main>`, `<section>` con `aria-labelledby`, `<footer>`.
- `alt` descriptivo en todas las imágenes — decir qué disciplina se ve, no "foto 1".
- Enlaces con texto propio; nada de "click acá".

### 8.6 Performance

- `next/image` en todo. `priority` **solo** en la imagen del hero.
- Fuente con `display: swap` y `variable`.
- Video del hero servido desde R2: `poster`, `preload="none"`, `muted`, `playsInline`,
  `loop`. Iniciarlo después del contenido crítico y mantener el poster para ahorro de datos
  y movimiento reducido.
- Player de Cloudflare Stream: no crear iframe ni cargar scripts hasta la interacción del
  usuario.
- Los componentes de animación son cliente; las secciones de texto puro se quedan como
  Server Components. No poner `"use client"` en el `page.tsx`.
- Lighthouse objetivo: ≥ 95 en Performance, Accesibilidad, Best Practices y SEO.

---

## 9. Placeholders y entrega de material

Andrea todavía no entregó fotos ni video. Construir con placeholders y dejar
`public/media/README.md` con la lista exacta:

| Archivo | Uso | Proporción sugerida |
| --- | --- | --- |
| `hero.jpg` | Fondo del hero en Cloudflare Images | 16:9, mínimo 2400 px de ancho |
| `hero.mp4` | Video de fondo en R2 | 16:9, ≤ 8 MB, sin audio, 10–20 s en loop |
| `portrait.jpg` | Cloudflare Images · Retrato de "Sobre mí" | 3:4 vertical |
| `disciplina-hair-hanging.jpg` | Cloudflare Images · Suspensión capilar | 4:5 |
| `disciplina-aerial-lyra.jpg` | Cloudflare Images · Lira | 4:5 |
| `disciplina-aerial-drop.jpg` | Cloudflare Images · Cintas gota | 4:5 |
| `disciplina-aerial-silks.jpg` | Cloudflare Images · Tela aérea | 4:5 |
| `galeria-01.jpg` … `galeria-09.jpg` | Cloudflare Images · Galería | Mezcla de 4:5 y 16:9 |
| `reel.mp4` | Fuente para cargar en Cloudflare Stream | 16:9 |
| `reel-poster.jpg` | Poster del reel en Cloudflare Images | 16:9 |
| `og.jpg` | Cloudflare Images · Fallback de redes | 1200×630 |

Los placeholders deben ser bloques en la paleta del sitio con el nombre del archivo
encima, no fotos de stock: así se ve de un vistazo qué falta.

### Distribución de medios

- Las imágenes finales y posters se publican en Cloudflare Images con variantes responsive.
- Los videos cortos en loop se publican en R2 mediante un dominio público dedicado,
  idealmente `media` bajo el dominio del sitio.
- Los reels y videos largos se cargan en Cloudflare Stream para obtener transcodificación,
  streaming adaptativo y poster/thumbnails.
- El código utiliza únicamente URLs e identificadores públicos. Las credenciales de Images,
  R2 y Stream quedan exclusivamente en Cloudflare y nunca se exponen en Vercel o el navegador.
- Centralizar la URL de entrega de Images, la URL pública de R2 y los UID de Stream en
  `src/data/site.ts` cuando el cliente entregue esos valores.

---

## 10. Criterios de aceptación

El trabajo está terminado cuando **todo** esto pasa:

```bash
npm run build
npm run lint
```

- [ ] `npm run build` termina sin errores ni warnings de tipos.
- [ ] `/es` y `/en` renderizan las nueve secciones completas, con el mismo contenido.
- [ ] Las dos rutas se prerenderizan estáticamente (verlo en la salida del build).
- [ ] `curl -s localhost:3000/es | grep -i "suspensión capilar"` devuelve resultado —
      el contenido está en el HTML del servidor, no depende de JS.
- [ ] Mismo chequeo en `/en` con "hair hanging".
- [ ] `/sitemap.xml` y `/robots.txt` responden y usan el valor de `NEXT_PUBLIC_SITE_URL`.
- [ ] El HTML de cada locale declara `canonical` y los tres `hreflang` (`es`, `en`,
      `x-default`).
- [ ] El JSON-LD `Person` valida sin errores.
- [ ] `/opengraph-image` devuelve una imagen 1200×630 correcta.
- [ ] El selector de idioma mantiene la sección en la que estaba el usuario.
- [ ] `es.json` y `en.json` tienen el mismo set de claves (comprobarlo, no asumirlo).
- [ ] Con `prefers-reduced-motion: reduce` no hay parallax, ni scroll hijacking, ni
      reveals; el sitio es plenamente usable.
- [ ] Navegable con teclado de punta a punta; foco visible; el lightbox atrapa y devuelve
      el foco y cierra con Esc.
- [ ] Sin errores en la consola del navegador.
- [ ] Responsive verificado en 375, 768, 1280 y 1920 px.
- [ ] Lighthouse ≥ 95 en las cuatro categorías.

---

## 11. Orden de trabajo sugerido

1. Scaffolding, dependencias, tokens de color, Poppins, `globals.css`.
2. next-intl: routing, request, layout `[locale]`, `messages/es.json` y `en.json`
   completos desde `content/andrea.md`. **Antes que cualquier componente**, para no
   tener que desharcodear strings después.
3. Estructura estática de las nueve secciones, sin animación, con placeholders. Verificar
   que se lee entero y que responde bien.
4. SEO completo: metadata, sitemap, robots, OG image, JSON-LD. Verificar con los
   criterios de §10 antes de seguir.
5. Recién ahí, la capa de animación: Lenis, `Reveal`, `SplitText`, `Parallax`, y después
   las animaciones específicas de cada sección en el orden del catálogo de §6.
6. Movimiento reducido, accesibilidad, foco, teclado.
7. Pasada de performance y Lighthouse.
8. `README.md` con cómo correrlo, cómo cambiar el dominio y cómo reemplazar el material.

Hacer commits por etapa, en inglés, siguiendo el estilo de los otros repos.

---

## 12. Huecos abiertos

Cosas que dependen del cliente y no bloquean el desarrollo:

- **Fotos y video.** Sin entregar. Placeholders y `public/media/README.md`.
- **Confirmar la exclusión** de Circo Dacktari, que estaba en el CV viejo y no aparece en
  la versión en limpio.
- **Google Search Console.** Una vez publicado: verificar la propiedad de
  andreabelenalfonzo.com y enviar el sitemap. No se puede hacer antes.

Resuelto el 2026-08-28: dominio (**andreabelenalfonzo.com**), nombre de INOVACIRCO para
el show del 5 de abril de 2025 e incorporación de Circo Arlequín y Circo Morsicomics a la
experiencia laboral. Compañía Turnoc también fue incorporada con sus tres producciones y
se sumó *Edén — Lo salvaje de la naturaleza*.
