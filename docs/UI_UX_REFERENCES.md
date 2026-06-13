# Kampung Iman — UI/UX Reference Board

Source references:
- https://refero.design/
- https://ui.aceternity.com/
- https://www.componentry.fun/
- https://dotmatrix.zzzzshawn.cloud/

Goal: turn these references into a practical UI/UX direction for a children’s Islamic 3D learning game, not copy them literally.

---

## 1) Refero — research-first UX system

### What it does well
- Clean white editorial canvas with lots of breathing room.
- Large refined headline, minimal copy, clear hierarchy.
- Research/task box in the center: one strong input area + mode chips.
- Categorization by Page Types, Flows, UX Patterns, UI Elements, Sites, Fonts.
- Skeleton cards/loading placeholders keep the page feeling structured even before content loads.
- Rounded pills for filters/taxonomy.
- Big black CTA buttons, high contrast, no visual noise.

### Transfer to Kampung Iman
Use Refero as the model for **parent/teacher mode** and **quest organization**:
- Start screen should feel like a “guided learning setup”: name, character, age/level, topic.
- Quests grouped by taxonomy:
  - Adab
  - Ilmu
  - Sadaqah
  - Kind Words
  - Helping Others
  - Patience
- Parent/teacher review panel can show source tags like: Qur’an 2:83, Qur’an 20:114, Sahih Bukhari/Muslim.
- Quest cards should use clean chips: `Adab`, `Easy`, `Hadith`, `Qur'an`, `Practice`.
- Use skeleton shimmer/loading cards when world/assets/audio are loading.

### Concrete UI components to build
- **Quest Library Drawer**: category chips + quest cards.
- **Parent Review Panel**: source list, lesson text, child-friendly summary.
- **Learning Progress Map**: grid/list of completed activities.
- **Source Badge Component**: small pill under every lesson/quiz.

---

## 2) Aceternity UI — premium landing + motion blocks

### What it does well
- Bold, huge headline with tight typography.
- Clean white/black contrast.
- Bento grids and layered cards.
- Framer Motion-style interactions: hover glow, reveal, parallax, card glare.
- Polished CTA buttons with hierarchy: primary black, secondary outline.
- Dashboard-in-browser mockup frame creates product depth.
- Social proof/logos/testimonials arranged in clean grids.

### Transfer to Kampung Iman
Use Aceternity as the model for **premium start menu and quest completion feedback**:
- Start screen: big emotional headline, bento cards for character choice and current mission.
- Quest cards: soft glow when player is nearby.
- Completion: animated card with points, lesson, source badge, next activity CTA.
- HUD should use card layering, depth shadows, crisp black/cream/emerald contrast.
- Use subtle motion only: scale 1.02, glow, fade, slide. Avoid over-animated “AI template” feel.

### Concrete UI components to build
- **Bento Start Menu**:
  - Character preview card
  - Name input card
  - Topic/mission card
  - Sound setting card
- **Quest Complete Card**:
  - Big reward text
  - Explanation
  - Source badge
  - Continue button
- **Nearby Quest Glow**:
  - Quest NPC circle glows/pulses only when near.
- **Mini Progress Bento**:
  - Score, quests, current zone, sound state.

---

## 3) Componentry — motion-rich interactive primitives

### What it does well
- Dark, premium, technical visual language.
- Strong “components with motion” positioning.
- Grid of interactive demos with rounded cards.
- Motion primitives: matrix rain, scroll velocity, infinite icon field, magnet lines, dither gradient, animated gradient, magnetic dock.
- Hover/magnetic interactions feel tactile and alive.
- Excellent spacing and consistent card sizing.

### Transfer to Kampung Iman
Use Componentry for **game-feel microinteractions**, not for the whole visual style:
- Magnetic dock idea → mobile/action controls can slightly react to touch/hover.
- Magnet lines → subtle “guidance rays” pointing to nearby quest/activity.
- Animated gradient/dither → quest portals/activity circles.
- Infinite icon field → loading screen with soft Islamic geometric motifs, not random emoji.
- Motion cards → character selection buttons feel tactile.

### Concrete UI components to build
- **Magnetic Action Dock**: bottom mobile controls snap/scale slightly on press.
- **Quest Guidance Lines**: soft lines/particles leading to closest activity.
- **Animated Activity Portal**: gradient ring around NPC/scene.
- **Motion Character Cards**: selected character gets glow + small bob.

---

## 4) Dot Matrix — loader, status, and retro-system feedback

### What it does well
- Strong dot-matrix identity.
- Black background, white dot typography, small loader cards.
- Many loader patterns with descriptive names.
- Theme presets: mint, sunset, ocean, neon, aurora, fire, prism.
- Excellent for loading/progress states because every animation implies “system is working”.

### Transfer to Kampung Iman
Use Dot Matrix as the model for **loading, saving, and quest state feedback**:
- Loading world/assets/audio: dot-matrix loader with “Preparing Kampung Iman…”
- Quest pending state: dot pulsing ring around activity.
- Answer feedback: small dotted progress pattern filling in.
- Audio loading/toggle: small sound-bar loader.
- Use friendly palette: emerald/mint/gold, not cyberpunk neon.

### Concrete UI components to build
- **World Loading Screen**: dot loader + asset checklist.
- **Quest Pending Indicator**: dotted ring animation.
- **Save/Progress Loader**: tiny dot matrix near progress HUD.
- **Audio Visualizer**: sound bars when audio is on.

---

## Recommended visual direction for Kampung Iman

### Design keywords
- Cozy premium kids game
- Islamic respectful educational UI
- Bento cards + soft glass panels
- Warm cream + emerald + gold
- Minimal dark accents for contrast
- Tactile buttons, rounded but not childish
- Motion used for meaning: guide, reward, progress

### Palette
- Background cream: `#fffbe8`
- Deep emerald: `#14523e`
- Fresh green: `#22a06b`
- Gold reward: `#ffd166`
- Clay road: `#665a4b`
- Sky blue accent: `#86d7ff`
- Dark text: `#173a30`
- Soft card: `rgba(255, 251, 226, 0.88)`

### Typography
- UI/body: Inter or Geist-style sans.
- Hero/start headings: bigger, confident, tight line-height.
- Avoid too much decorative/Arabic-style typography unless reviewed; keep children’s readability first.

### Motion rules
- Nearby quest: pulse/glow.
- Correct answer: gold sparkle + card lift.
- Wrong answer: gentle shake/soft encouragement, no harsh red.
- Loading: dot-matrix / activity checklist.
- Touch controls: press scale and slight magnetic movement.

### UI layout rules
- Desktop:
  - top HUD as bento glass bar
  - bottom/side quest card
  - modal for quiz/activity
- Mobile:
  - compact HUD
  - bottom joystick/action dock
  - lesson card above controls
  - modals full-width with large buttons

---

## Immediate implementation backlog

### Phase A — quick polish
1. Add dot-matrix loading overlay before game start.
2. Add source badges to quiz modal.
3. Add quest category chips in modal.
4. Add selected character card glow.
5. Add audio visualizer bars next to Sound On.

### Phase B — game-feel
1. Add nearest quest guidance particles/line.
2. Add quest NPC proximity glow.
3. Add tactile press animations for joystick/action buttons.
4. Add completion card with Aceternity-style bento reward.

### Phase C — parent/teacher UX
1. Add parent review drawer.
2. Add source register per quest.
3. Add progress map by topic.
4. Add child profile summary.

### Phase D — production polish
1. Replace procedural character with optimized low-poly GLB models.
2. Add real audio files and volume controls.
3. Add proper physics engine/colliders.
4. Add real loading pipeline for skybox/textures/models/audio.

---

## What NOT to copy
- Don’t copy Aceternity’s SaaS/marketing testimonial sections into a kids game.
- Don’t use Componentry’s dark cyber aesthetic as the main children’s UI.
- Don’t use Dot Matrix neon/cyberpunk palette heavily; adapt the loader logic only.
- Don’t overload the game with motion; keep motion meaningful and readable.
- Don’t put sacred text into animated decorative/physics elements.
