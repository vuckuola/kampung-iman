# Kampung Iman WebGL — Release Quality Gates

> PM gate for the playable go-live vertical slice.

## Scope
A polished, browser-playable Three.js/WebGL educational Islamic driving game inspired by the playful interaction energy of bruno-simon.com, but fully original and respectful.

## Must-pass gates

### 1. Product / learning
- Player understands objective within 5 seconds.
- Player can drive, collect wisdom orbs, answer quizzes, and see progress.
- Content is child-friendly and sourced from Qur'an or well-known sahih hadith.
- No depiction of prophets, angels, sahabah, sacred unseen figures, or human faces.

### 2. Game feel
- Vehicle has acceleration, braking, turning, wheel spin, and subtle body tilt/bob.
- Camera follows smoothly without nausea.
- Collectibles are visible, animated, and satisfying.
- End state appears when all orbs are collected.

### 3. Visual polish
- Low-poly cohesive world: warm sky, fog, road, trees, zone buildings, markers, readable signage/UI.
- Premium playful palette: emerald/teal/gold/warm clay.
- No placeholder Vite UI remains.
- HUD is readable on desktop and mobile.

### 4. Static/build
- `npm run build` passes.
- TypeScript has no errors.
- Production `dist/` is generated.

### 5. Runtime smoke
- Dev server returns HTTP 200.
- WebGL scene renders in browser, not blank canvas.
- Browser console has no fatal runtime errors.
- Visual QA confirms car/world/HUD are visible.

### 6. Go-live readiness
- README contains install/run/build instructions.
- `dist/` can be served as static site.
- Known limitations are documented honestly.
