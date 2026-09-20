# Andrea Belén Alfonzo

Portfolio one-page bilingüe de Andrea Alfonzo, artista circense, aerialista y bailarina.

## Desarrollo

```bash
npm install
npm run dev
```

El sitio queda disponible en `/es` y `/en`.

## Verificación

```bash
npm run lint
npm run build
```

## Configuración

Copiar las variables documentadas en `.env.example` a `.env.local` para desarrollo.
En Vercel, definir `NEXT_PUBLIC_SITE_URL` con el dominio de producción.

Variables adicionales (solo servidor):

- `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_DATABASE_ID`, `CLOUDFLARE_D1_API_TOKEN` — persistencia del estado de la galería.
- `CLOUDFLARE_ACCESS_TEAM_DOMAIN`, `CLOUDFLARE_ACCESS_AUD`, `ADMIN_ALLOWED_EMAILS` — autenticación del panel `/admin`.

## Panel de curación de galería

`https://admin.andreabelenalfonzo.com` está protegido por Cloudflare Access y valida el token `Cf-Access-Jwt-Assertion`
server-side con `jose`. Permite reordenar, ocultar y restaurar las 64 imágenes de la
galería pública sin borrar los archivos de Cloudflare Images.

### Setup de D1

1. Crear una base Cloudflare D1.
2. Ejecutar `sql/gallery-state.sql` (crea la tabla y la fila inicial).
3. Crear un API token limitado a lectura y escritura de D1 para esa cuenta.
4. Definir las variables de entorno de D1 en Vercel.

### Acceso por código de email

1. El dominio de producción debe pasar por el proxy de Cloudflare; las URLs directas de
   Vercel no tienen acceso al panel.
2. En Cloudflare Zero Trust, activar **One-time PIN** como proveedor de identidad.
3. Crear una única aplicación Access que proteja todo el hostname configurado en
   `ADMIN_SITE_URL`.
4. Crear una política `Allow` únicamente con los emails de Andrea y del administrador.
5. Copiar el dominio del equipo y el AUD de la aplicación a
   `CLOUDFLARE_ACCESS_TEAM_DOMAIN` y `CLOUDFLARE_ACCESS_AUD`.
6. Definir los mismos emails, separados por coma, en `ADMIN_ALLOWED_EMAILS`.

El servidor vuelve a validar firma, issuer, audience y email de cada JWT de Access; no
depende solamente de la protección configurada en el proxy de Cloudflare.

Si D1 no está configurado, la galería pública usa el orden estático `001..064`.

## Material visual

Los archivos requeridos y sus proporciones están documentados en
`public/media/README.md`. Mientras no estén disponibles, el sitio muestra bloques de la
paleta con el nombre de cada archivo pendiente.

La infraestructura definida es Cloudflare Images para imágenes y posters, R2 para videos
cortos en loop y Cloudflare Stream para reels o videos largos. El frontend solo utiliza
URLs e identificadores públicos; ninguna credencial de Cloudflare forma parte del proyecto.

El panel de galería usa Cloudflare D1 para persistir el orden y la visibilidad de las
imágenes. No se almacenan secretos de Cloudflare Images, R2 ni Stream en el repositorio.
