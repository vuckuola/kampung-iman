# Kampung Iman WebGL Technical Architecture

## Product goal
A playful browser-based Islamic education driving game inspired by toy-like WebGL portfolio worlds. The player drives a small low-poly car through a village (`kampung`) with themed learning zones. The v0 avoids depictions of prophets, angels, sacred unseen beings, and human faces; learning is represented through architecture, signage, nature, abstract orbs, and text quizzes.

## v0 prototype scope
- Vite + TypeScript + Three.js single-page application.
- Third-person drivable toy car with simplified arcade physics.
- Low-poly environment with roads, buildings, trees, zone markers, shadows, fog, and bright colors.
- Three education zones: `Adab`, `Ilmu`, `Sadaqah`.
- Collectible glowing knowledge orbs.
- Quiz modal on orb collection.
- Score and orb progress HUD.

## Runtime architecture

```text
src/main.ts
 ├─ static content data
 │   ├─ zone metadata: title, color, world position, lesson text
 │   └─ quiz bank by zone
 ├─ DOM/HUD layer
 │   ├─ score/progress controls
 │   ├─ contextual lesson card
 │   └─ native dialog quiz modal
 ├─ Three.js scene layer
 │   ├─ renderer/camera/lights/fog
 │   ├─ ground and road meshes
 │   ├─ low-poly car group
 │   ├─ procedural buildings and trees
 │   └─ collectible orb meshes
 └─ game loop
     ├─ input state
     ├─ simplified vehicle controller
     ├─ third-person follow camera
     ├─ orb collision checks
     └─ quiz/score state transitions
```

## Key systems

### Vehicle controller
The v0 intentionally avoids a heavy physics engine. The controller integrates acceleration, damping, braking, steering, and world bounds directly against the car transform. This is enough to test feel and learning flow. If the prototype grows, swap this for Rapier or Cannon-ES behind a `VehicleController` interface.

### Learning content
Content is plain typed data in `main.ts` for speed. Next iteration should move content into versioned JSON/MD files:

```text
content/zones/*.json
content/quizzes/*.json
```

That makes educator review, localization, and safety checks easier without editing game logic.

### Interaction model
Each orb owns a zone and quiz. On collision, the game pauses, opens a modal, evaluates the answer, hides the orb, and updates score. Incorrect answers still grant partial points to encourage young learners.

### Visual/religious safety constraints
- No prophets, angels, unseen beings, or human faces.
- Use abstract symbols, architecture, nature, geometry, calligraphy-inspired patterns, and text.
- Keep quiz copy general and educational; avoid issuing religious rulings beyond simple values unless reviewed by qualified educators.

## Recommended next milestones
1. Split `main.ts` into modules: `scene/`, `entities/`, `systems/`, `content/`, `ui/`.
2. Add GLTF support for custom low-poly assets and compressed textures.
3. Add audio feedback and settings for muting/reduced motion.
4. Add mobile touch controls.
5. Add content review pipeline and age-appropriate quiz packs.
6. Add save/progress state in `localStorage`.
7. Add automated smoke test with Playwright to verify canvas loads and quiz modal opens.
