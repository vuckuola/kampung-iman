# Texture Pack & Skybox Notes

## Added in this pass
- Generated and QC'd a warm low-poly village skybox: `public/assets/kampung-iman-skybox.png`.
- Procedural texture pack inside `src/main.ts`:
  - grass texture with blade/noise strokes
  - stone/clay road texture
  - plaster wall texture
  - roof tile texture
  - wood grain texture
  - leaf texture
  - glossy toy-car paint texture
- Additional road stripes/detail so the driving route reads better.

## Safety QC
The generated skybox was checked before integration:
- no readable text
- no people or faces
- no logo/watermark
- only distant abstract mosque-like architecture silhouettes
- no sacred text or religious object used as a prop

## Runtime note
The textures are lightweight canvas/generated textures plus one 1024x576 PNG skybox, so GitHub Pages deploy remains static and fast.
