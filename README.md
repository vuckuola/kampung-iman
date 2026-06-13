# Kampung Iman WebGL

**Kampung Iman WebGL** is a browser-playable Three.js/WebGL vertical slice for a warm, child-friendly Islamic learning driving game. Players drive a small toy-like car through a low-poly village, collect glowing wisdom orbs, and answer short quizzes grounded in Qur'an references and widely known sahih hadith reports.

This go-live slice is intended to prove the core product promise: **playful exploration + respectful Islamic learning + static-web deployability**.

## Release: Go-Live Vertical Slice

### Product positioning

Kampung Iman is designed for children and families who want a safe, joyful way to explore basic Islamic values through interactive play. It takes inspiration from playful WebGL driving experiences, but uses original art direction, original gameplay framing, and strict content-safety boundaries appropriate for Islamic education.

**Target audience:** children ages 6–12, ideally with a parent, caregiver, or teacher nearby.  
**Session length:** 5–15 minutes.  
**Platform:** modern desktop browser with WebGL support; static site hosting for production builds.

### What is included in this slice

- A Vite + TypeScript + Three.js single-page WebGL game.
- A low-poly village scene with roads, trees, buildings, fog, warm lighting, and zone markers.
- A drivable toy car with acceleration, braking, turning, wheel spin, body tilt/bob, reset, and a smooth follow camera.
- Three learning zones:
  - **Adab Courtyard** — good manners, kind speech, respect.
  - **Ilmu Library** — seeking knowledge, time, patience, good words.
  - **Sadaqah Garden** — charity, caring for others, giving sincerely.
- 12 collectible wisdom orbs.
- Multiple-choice quiz modal on orb collection.
- Score and orb-progress HUD.
- End-state message after all orbs are collected.
- Static `dist/` output suitable for deployment.

## Gameplay

1. The player starts in Kampung Iman with a small toy car.
2. The player drives around the village and looks for glowing wisdom orbs.
3. Colliding with an orb pauses driving and opens a short quiz.
4. A correct answer grants full points; an incorrect answer still grants partial encouragement points.
5. The orb disappears, progress updates, and the player continues exploring.
6. When all 12 orbs are collected, the game shows a completion message.

The loop is intentionally forgiving: there is no combat, no harsh failure state, and no shaming feedback.

## Controls

### Keyboard / desktop

| Action | Input |
| --- | --- |
| Accelerate | `W` or `Arrow Up` |
| Reverse | `S` or `Arrow Down` |
| Turn left | `A` or `Arrow Left` |
| Turn right | `D` or `Arrow Right` |
| Brake | `Space` |
| Reset / unstuck | `R` |
| Continue quiz | Click/tap the modal button |

### Mobile / touch

The UI is responsive enough to view on mobile-sized screens, but this vertical slice does **not** yet include dedicated on-screen driving controls. For the current go-live slice, keyboard desktop play is the supported path.

## Islamic Safety Constraints

The project follows explicit visual and content guardrails so the experience remains respectful and family-safe.

### Representation rules

- Do **not** depict prophets, messengers, angels, sahabah/sahabiyah, sacred unseen beings, or historical sacred figures.
- Avoid visible human faces in gameplay art; use architecture, nature, geometry, signage, abstract collectibles, and text-based learning instead.
- Do not place Qur'an verses, the name of Allah, mushaf imagery, prayer rugs, mimbar/mihrab, or other sacred objects as collision props or comedy-physics objects.
- Mosque- or learning-themed environments should remain calm and symbolic, not slapstick.

### Content rules

- Child-facing copy must be gentle, simple, and non-shaming.
- Qur'an references should be cited clearly when used.
- Hadith content should be limited to widely known sahih reports unless reviewed by qualified educators.
- Avoid detailed or controversial fiqh rulings in gameplay copy.
- This slice teaches broad values such as good speech, kindness to parents, seeking knowledge, mercy, patience, and charity.

### Source policy in this slice

The quiz/content pack references child-friendly lessons from:

- Qur'an 2:83 — speak good to people.
- Qur'an 17:23 — kindness to parents.
- Qur'an 20:114 — “My Lord, increase me in knowledge.”
- Qur'an 49:11 — do not ridicule or insult one another.
- Qur'an 49:13 — know one another.
- Qur'an 94:5–6 — with hardship comes ease.
- Qur'an 103:1–3 — faith, good deeds, truth, and patience.
- Sahih al-Bukhari and Sahih Muslim reports on good words, removing harm from the road, mercy, and loving good for others.

For production curriculum expansion, keep a reviewer-approved source register and expose source lines in a parent/teacher review panel.

## Install, Run, and Build

### Prerequisites

- Node.js 20+ recommended.
- npm.
- A modern browser with WebGL support.

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Vite will print a local URL, typically `http://localhost:5173/`.

### Production build

```bash
npm run build
```

This runs TypeScript compilation and generates the production static site in:

```text
dist/
```

### Preview the production build

```bash
npm run preview
```

Use this to smoke-test the generated `dist/` output before deployment.

## Deployment Notes

The app is a static Vite build. After `npm run build`, deploy the contents of `dist/` to any static host, for example:

- Netlify
- Vercel static output
- Cloudflare Pages
- GitHub Pages
- S3/CloudFront or equivalent object storage/CDN
- Any nginx/Apache static file server

Recommended deployment checks:

1. Serve `dist/` over HTTPS.
2. Confirm `index.html` returns HTTP 200.
3. Open the deployed page in a WebGL-capable browser.
4. Verify the canvas is not blank.
5. Confirm the HUD displays score and orb progress.
6. Drive into at least one orb and confirm the quiz modal opens.
7. Complete all orbs once and confirm the end-state message appears.
8. Check the browser console for fatal runtime errors.

No backend service or database is required for this slice.

## Quality Gates for Go-Live

This README supports the release gates in [`PHASE_QUALITY_GATES.md`](./PHASE_QUALITY_GATES.md):

- Player objective is communicated immediately in the HUD.
- Player can drive, collect wisdom orbs, answer quizzes, and see progress.
- Content is child-friendly and tied to Qur'an or widely known sahih hadith references.
- Visuals avoid prophets, angels, sahabah, sacred unseen figures, and human faces.
- Game feel includes acceleration, braking, steering, wheel spin, body motion, animated collectibles, and a smooth camera.
- `npm run build` must pass before publishing.
- `dist/` can be served as a static site.
- Known limitations are documented below.

## Known Limitations

This is a go-live vertical slice, not the full MVP described in the broader product specification.

- **Keyboard-first controls:** no virtual joystick or dedicated touch driving controls yet.
- **No audio pass yet:** no narration, sound effects, mute toggle, or music settings.
- **No persistence:** score/progress resets on refresh; no `localStorage` save system.
- **No parent dashboard yet:** sources exist in content data, but there is no dedicated parent/teacher review screen.
- **Limited content depth:** 12 quiz orbs across 3 zones; no full mini-game framework yet.
- **No educator review workflow in-app:** future content should use versioned JSON/MD with `review_status` metadata and scholarly/educator sign-off.
- **Procedural/simple art only:** current environment uses code-generated low-poly meshes, not final GLTF asset kits.
- **Accessibility work remains:** reduced motion, text-size controls, high-contrast mode, and full keyboard focus review are still needed.
- **Browser/device matrix not complete:** manually smoke-test target browsers and lower-end mobile hardware before broad public launch.

## Related Documentation

- [`PHASE_QUALITY_GATES.md`](./PHASE_QUALITY_GATES.md) — go-live quality gates.
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — technical architecture and next milestones.
- [`docs/product-spec-content-direction.md`](./docs/product-spec-content-direction.md) — product vision, content principles, and MVP direction.
- [`docs/art-direction.md`](./docs/art-direction.md) — low-poly visual style and Islamic representation rules.
- [`docs/learning-content-summary.md`](./docs/learning-content-summary.md) — source policy and learning content summary.

## Release Owner Notes

Before sharing externally, run the production build and a browser smoke test. Treat any new religious text, Arabic calligraphy, hadith reference, worship-related interaction, or mosque-area mechanic as requiring content review before merge or release.
