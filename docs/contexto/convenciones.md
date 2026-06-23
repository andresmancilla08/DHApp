# Convenciones

## Estilo
- TypeScript + ESLint (`eslint.config.mjs`). Tailwind v4 con tokens `@theme` (estética oscura/dorada de Daggerheart).

## Patrones que SÍ usamos
- **Mobile-first total.** Validar toda UI con el equipo visual completo.
- **i18n con react-i18next** (NO next-intl). Todo texto visible usa `t()`.
- **CTAs anclados al fondo:** botones de acción con `pb-safe + 1rem`; nunca en medio del contenido.
- Contenedor de botón de acción: padding 15px; botón superior `margin-top: 20px`.
- Auth server-side: nunca exponer credenciales Firebase al cliente.

## Patrones PROHIBIDOS
- next-intl · Firebase client SDK · strings hardcodeados · CTAs flotando en medio del scroll.

## Tests
- TODO: sin suite documentada. Validar build (`next build --webpack`) y flujos en móvil.

## Commits
- Commit tras cada ajuste. Deploy solo con permiso.
