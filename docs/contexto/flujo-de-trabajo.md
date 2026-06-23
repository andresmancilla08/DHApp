# Flujo de Trabajo

## Antes de tocar código
- Leer `docs/contexto/`. Ante cualquier regla de Daggerheart: `grep` en `corebook.txt` y citar página.

## Implementar cambios
1. Editar. Todo texto con `t()` (react-i18next). CTAs anclados al fondo.
2. Si es UI: validar con el equipo visual (mobile-first).
3. `git commit` tras cada ajuste.

## Checklist "terminado"
- [ ] `next build --webpack` pasa. [ ] Sin strings hardcodeados. [ ] Reglas citadas del CoreBook.
- [ ] Equipo visual firmó (si UI). [ ] Commit hecho.

## Deploy (solo con permiso)
- Push a la rama → GitHub Actions despliega a Vercel (grimheart.co). Bump versión antes.
