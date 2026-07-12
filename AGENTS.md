<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Versionado — obligatorio antes de cada commit

El historial vive en el **changelog-service central**, no en este repo.

**Flujo antes de cada commit:**

```
MCP tool: add_changelog_entry({
  clientId: "ai4u",
  appId: "order-loader-ui",
  appName: "Order Loader UI",   // solo la primera vez
  bump: "patch",            // "patch" | "minor" | "major"
  date: "YYYY-MM-DD",
  changes: [
    "feat: descripción del cambio",
    "fix: otro cambio si aplica"
  ]
})
```

`bump` calcula la versión automáticamente a partir de la anterior.

**Cuándo usar cada bump:**
- `patch` — fix, chore, refactor, ajuste menor
- `minor` — feat nueva visible para el usuario
- `major` — breaking change o release significativo

**Prefijos de cambios:** `feat:` `fix:` `refactor:` `chore:`
