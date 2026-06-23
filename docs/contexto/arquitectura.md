# Arquitectura

**En una frase:** PWA mobile-first para crear y gestionar hojas de personaje de Daggerheart (TTRPG), bilingüe EN/ES. Producto: **GrimHeart**.

## Stack
- **Framework:** Next.js 16 (App Router, React 19, TypeScript).
- **Estilos:** Tailwind CSS v4 con tokens `@theme`.
- **i18n:** react-i18next (EN/ES, detección automática) — `src/i18n`.
- **PWA:** Serwist (`@serwist/next`) + manifest + offline. Build con **webpack** (`next dev/build --webpack`).
- **Auth:** usuario + PIN; sesiones firmadas con `jose` (JWT); hash con `bcryptjs`.
- **BD:** Firebase Firestore vía **Admin SDK server-side** (sin SDK cliente).
- **Deploy:** Vercel → **grimheart.co** vía GitHub Actions.

## Mapa de carpetas
- `src/app/` — rutas App Router. `src/components/` — UI. `src/lib/` — auth, Firestore admin, helpers. `src/i18n/` — traducciones.
- `public/art/` — arte. Raíz: `CoreBook.pdf` + `corebook.txt` (gitignored, fuente de reglas).

## Flujo de datos
UI (client) → Server Actions / route handlers en `src/app` → `src/lib` (Firebase Admin SDK) → Firestore. Auth: PIN → verificación server → cookie JWT firmada con `jose`.

## Lo que NO existe
- Sin Firebase client SDK (todo server-side). Sin Turbopack (build forzado a webpack por Serwist).
