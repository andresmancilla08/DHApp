# DHApp — reglas de proyecto

## Fuente canónica del juego: CoreBook (REGLA OBLIGATORIA)

**TODO** el contexto, reglas, datos y contenido de Daggerheart que se plasme en la app
DEBE salir del libro oficial `CoreBook.pdf` (raíz del repo, solo local, gitignored).

- El PDF pesa ~175 MB y no se puede leer directo. Hay una extracción de texto buscable en
  `corebook.txt` (también gitignored). **Usa `grep` sobre `corebook.txt`** para localizar
  reglas/datos y citar la página (`===== PAGE N =====`).
- Para arte/maquetación que el texto no captura, leer rangos del PDF con la tool de PDF
  (máx ~20 págs/llamada) cuando haga falta.
- Ante cualquier duda de reglas (creación, niveles, dominios, cartas, equipo, ancestries,
  communities, daño, Hope/Fear, etc.) **consultar el CoreBook antes de inventar**. No usar
  conocimiento de memoria si contradice el libro.
- `src/lib/daggerheart/reference.ts` y los datos importados deben coincidir con el CoreBook.

## Ilustraciones — REGLA OBLIGATORIA

**TODA** ilustración que aparezca en la app (clases, ancestrías, comunidades, equipo, cartas
de dominio, enemigos, etc.) **DEBE extraerse del CoreBook.pdf**. Nunca usar placeholders
genéricos, gradientes permanentes ni generar con IA cuando el CoreBook tiene la imagen.

Flujo obligatorio al implementar cualquier entidad visual nueva:
1. Buscar la sección en `corebook.txt` con `grep` → identificar páginas.
2. Extraer con pymupdf (`fitz`) las imágenes de esas páginas.
3. Elegir la imagen más grande y a color (verificar con PIL que avg(max-min RGB) > 15).
4. Comprimir: `sips -Z 800 … && sips -s formatOptions 82 …` → máx ~200KB.
5. Guardar en `public/art/<categoría>/<clave>.jpg` y referenciar en el componente.

Gradientes/fallbacks solo se permiten de forma **temporal** mientras se extrae el arte real.
Una vez extraídas, las rutas en el mapa de arte del componente deben estar activas.

## Diseño visual (REGLAS OBLIGATORIAS)

- **Mobile-first SIEMPRE.** La app se usa principalmente en móvil. Toda pantalla/componente
  se diseña primero para móvil y luego escala; todo debe ser **totalmente responsive**
  (probar 360px → tablet → desktop, touch targets ≥44px, sin overflow horizontal).
- La UI debe estar **basada en la estética de Daggerheart** (oscuro, dorado tipo "Hope",
  púrpura tipo "Fear", tipografía serif heroica Cinzel). Tokens en `globals.css`.
- **Validar SIEMPRE con el equipo visual** (los 5: ui-ux-pro-max, Amil/emil-design-eng,
  frontend-design, oh-my-claudecode:designer, impeccable) ANTES de declarar cualquier
  pantalla o componente como completo. Sin excepción.

### Patrones móviles (seguir SIEMPRE)

- **Top bar**: usar `AppHeader` (sticky, `pt-safe`, marca a la izquierda + `AppMenu`
  avatar a la derecha). Nunca amontonar acciones (idioma, logout, etc.) en la barra.
- **Acciones/menús/overlays**: usar `BottomSheet` (`@/components/ui/BottomSheet`), NO
  dropdowns flotantes. Patrón nativo móvil: scrim con blur + panel desde abajo, grabber,
  `pb-safe`, cierre por scrim/Escape, bloqueo de scroll del body.
- **Diálogos (transversal)**: usar SIEMPRE `AppDialog` (`@/components/ui/AppDialog`) para
  confirmaciones, info y menús de acción. Construido sobre `BottomSheet`, mismo estilo.
- **Centrado**: títulos y contenido de diálogos/sheets van SIEMPRE centrados, nunca
  alineados a la izquierda. (Excepción: labels de campos de formulario, que van a la izq.)
- **Safe areas**: `viewport-fit=cover` ya activo. Usar utilidades `pt-safe` / `pb-safe`
  para notch/dynamic island/home indicator. Alturas con `min-h-dvh` (no `min-h-screen`).
- **Touch**: targets ≥44×44px; separación ≥8px entre elementos tocables.
- **Icon-button**: círculo translúcido de acento (`bg-gold/[0.12]` + `border-gold/30`),
  44px en barras, ~36px inline (regla global del usuario).
- **Tipografía responsive**: base móvil y escalar con `sm:` (ej. `text-3xl sm:text-4xl`).
  Limitar ancho de lectura con `max-w-[Nch]`.
- **Botones**: primario pill dorado (`rounded-full`, gradiente Hope); siempre `active:scale`.
- **CTA / acciones principales**: SIEMPRE ancladas al fondo de la pantalla en una barra fija
  (`shrink-0`, `pb-safe`, con `mb-4` extra). NUNCA flotan en medio del contenido.
- **Animaciones**: rápidas (≤200ms, easing `cubic-bezier`), respetar `prefers-reduced-motion`
  (sheets `dh-sheet`, popovers `dh-pop`, entradas `dh-rise`).
- **Verificación visual**: validar en 390px (iPhone) con screenshots reales antes de cerrar.

## Stack / convenciones

- Datos + auth: **Firebase** (Firestore + auth propio username/PIN server-side). Plan Spark (gratis).
- i18n EN/ES obligatorio (next-intl); nunca textos hardcodeados en JSX.
- Build/dev en `--webpack` (Serwist no soporta Turbopack en Next 16).

@AGENTS.md

## Documentación de contexto

Contexto del proyecto en `docs/contexto/` (leer antes de planificar cambios):
- [Arquitectura](docs/contexto/arquitectura.md) · [Convenciones](docs/contexto/convenciones.md) · [Decisiones](docs/contexto/decisiones.md)
- [Glosario y Entidades](docs/contexto/glosario.md) · [Flujo de Trabajo](docs/contexto/flujo-de-trabajo.md) · [Errores Conocidos](docs/contexto/errores-conocidos.md)
