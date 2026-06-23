# Decisiones

### CoreBook.pdf como única fuente de reglas — Vigente (OBLIGATORIA)
- **Qué:** Todo dato/regla de Daggerheart sale del `CoreBook.pdf` oficial. Usar `grep` sobre `corebook.txt` y citar página (`===== PAGE N =====`).
- **Por qué:** Exactitud de reglas (creación, niveles, dominios, cartas, daño, Hope/Fear). No usar memoria si contradice el libro.

### Auth usuario + PIN con JWT (jose) — Vigente
- **Qué:** Login propio user+PIN, sesión en cookie JWT firmada.
- **Descartado:** Firebase Auth cliente (se evita el SDK cliente por completo).

### Firestore solo Admin SDK (server-side) — Vigente
- **Por qué:** Seguridad; ninguna credencial ni lógica de datos en el cliente.

### Build con webpack, no Turbopack — Vigente
- **Por qué:** compatibilidad con Serwist (`@serwist/next`).
