# Errores Conocidos

### Build falla con Turbopack
- **Síntoma:** errores de service worker/PWA. **Causa:** Serwist requiere webpack. **Solución:** usar `--webpack` (ya en scripts).

### CoreBook.pdf no se puede leer directo
- **Síntoma:** PDF ~175 MB no parseable de golpe. **Solución:** `grep` sobre `corebook.txt`; para arte, leer rangos del PDF (≤20 págs/llamada). Ambos gitignored.

### Datos de Daggerheart "incorrectos"
- **A propósito:** si contradicen la memoria del modelo, gana el CoreBook.
