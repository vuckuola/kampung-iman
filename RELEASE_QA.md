# Kampung Iman WebGL — Release QA Report

Date: 2026-06-13

## Summary
Go-live vertical slice is ready as a static Vite/Three.js build.

## Verified gates

### Static/build
- Command: `npm run build`
- Result: PASS
- Output: `dist/`
- Note: Vite warns JS chunk is >500KB because Three.js is bundled. This is acceptable for v0; optimize with code splitting later.

### Runtime smoke
- Dev server: `http://127.0.0.1:5173/`
- HTTP status: 200 OK
- Browser console: no JS errors during smoke.

### Visual/browser QA
- WebGL canvas renders.
- Toy car visible and centered.
- Low-poly world, road, trees, zone building, glowing orbs, and HUD visible.
- HUD is readable.
- Bottom lesson card and controls are readable.
- No blank canvas or broken UI observed.

### Product safety
- No depiction of prophets, angels, sahabah, or human faces.
- Learning content is stored separately in `content/islamic-learning-content.json` and integrated in `src/content/lessons.ts`.
- Quiz content includes source lines.

## Current v0 limitations
- Vehicle physics is simplified, not full Rapier suspension yet.
- No audio/SFX yet.
- Mobile touch controls exist, but full mobile gameplay should receive deeper real-device QA.
- No hosted URL yet; `dist/` is ready for static deployment.

## Release artifact
- Static production build: `dist/`
- ZIP artifact: `kampung-iman-webgl-release.zip`
