# Biblioteca multimedia

Las imágenes y posters se alojan en **Cloudflare Images**, los videos cortos en loop en
**Cloudflare R2** y los reels o videos largos en **Cloudflare Stream**. Los nombres de esta
tabla identifican los originales que debe entregar la artista.

El 2026-08-29 se optimizaron y subieron las 63 fotografías entregadas a Cloudflare Images.
Usan IDs determinísticos desde `andrea-photo-001` hasta `andrea-photo-063`; cada imagen
conserva el nombre del archivo original en su metadata. El hero usa `andrea-photo-055` y
la selección de galería está declarada en `src/data/gallery.ts`.

| Archivo | Uso | Recomendación |
| --- | --- | --- |
| `hero.jpg` | Images · Fondo alternativo del hero | 16:9, mínimo 2400 px |
| `hero.mp4` | R2 · Video del hero | 16:9, máximo 8 MB, sin audio, loop de 10–20 s |
| `portrait.jpg` | Images · Retrato de Sobre mí | 3:4 vertical |
| `disciplina-hair-hanging.jpg` | Images · Suspensión capilar | 4:5 |
| `disciplina-aerial-lyra.jpg` | Images · Lira aérea | 4:5 |
| `disciplina-aerial-drop.jpg` | Images · Cintas gota | 4:5 |
| `disciplina-aerial-silks.jpg` | Images · Tela aérea | 4:5 |
| `galeria-01.jpg` a `galeria-09.jpg` | Images · Galería | Mezcla de 4:5 y 16:9 |
| `reel.mp4` | Stream · Reel destacado | 16:9, sin autoplay con sonido |
| `reel-poster.jpg` | Images · Portada del reel | 16:9 |
| `og.jpg` | Images · Imagen social alternativa | 1200 x 630 |

Antes de publicar, optimizar las imágenes y comprobar sus textos alternativos con el
contenido real de cada toma.

## Entrega al sitio

- De Cloudflare Images se necesita la URL pública de entrega y el ID de cada imagen.
- R2 debe exponer los loops mediante un dominio público estable; no usar URLs firmadas que
  expiren para el contenido del portfolio.
- De Cloudflare Stream se necesita el `customer code` público y el UID de cada video.
- No enviar ni guardar API tokens, Access Key IDs o Secret Access Keys en este repositorio.
- El sitio muestra el poster primero y crea el reproductor de Stream únicamente cuando el
  visitante presiona reproducir.
