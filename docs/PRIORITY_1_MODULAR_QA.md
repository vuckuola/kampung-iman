# Priority 1 Modularization QA — UI/Scene Split

Date: 2026-06-13

## Scope
User requested next-level items one-by-one with QA/QC/UAT per priority. Priority 1 was a safe modular split without changing core gameplay.

## Refactor completed
- Extracted DOM mounting and element queries from `src/main.ts` into `src/ui/dom.ts`.
- Extracted zone configuration from `src/main.ts` into `src/scene/zones.ts`.
- Extracted CSS design tokens from `src/style.css` into `src/styles/tokens.css`.
- Kept Vite + TypeScript + Three.js, no framework migration.
- Kept existing gameplay loop functional.

## QA/QC/UAT checks

### Static build
Command:

```bash
npm run build
```

Result:

```text
✓ built in 252ms
```

### Browser smoke
Local URL:

```text
http://127.0.0.1:5173/?cb=modular-p1
```

Verified:
- page title is `Kampung Iman WebGL`
- start grid exists
- character preview exists
- HUD current-zone element exists
- joystick exists
- CSS token loaded: `--color-primary = #2f7d5c`

### Interaction smoke
Triggered start button programmatically.

Result:

```json
{"startHidden": true, "player": "Aisyah", "audio": "Sound On"}
```

### Console health
Browser console returned:

```text
console errors: 0
js errors: 0
```

## Notes
This is priority 1 only: code structure improvement. It does not yet replace the lightweight collision system with Rapier or add GLB assets. Those should be separate priorities with their own QA gates.
