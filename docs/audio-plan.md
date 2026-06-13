# Audio & Song Plan

## Current implementation
The live game uses browser Web Audio so it works without external files:
- click/tap **Mulai Jelajah** to unlock audio permissions,
- **Sound On/Off** toggle controls the audio context,
- pickup/quest success plays a two-note sparkle sound,
- a very soft procedural pentatonic ambient melody plays while exploring.

This avoids autoplay blocks and keeps GitHub Pages fully static.

## How to replace with real sound/music later
Add files under `public/audio/`:

```text
public/audio/ambient-loop.mp3
public/audio/quest-pickup.mp3
public/audio/button-click.mp3
public/audio/win.mp3
```

Then replace the Web Audio tone helpers in `src/main.ts` with HTMLAudioElement or Three.js Audio:

```ts
const ambient = new Audio('./audio/ambient-loop.mp3')
ambient.loop = true
ambient.volume = 0.28
await ambient.play()
```

Recommended style:
- gentle gamelan-inspired plucks / soft marimba / warm pads,
- no loud percussion for children,
- no Qur'an recitation as background music/game SFX,
- keep Islamic content respectful and separated from comedy/physics feedback.
