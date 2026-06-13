# Graph Report - kampung-iman-webgl  (2026-06-13)

## Corpus Check
- 6 files · ~32,662 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 52 nodes · 100 edges · 7 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]

## God Nodes (most connected - your core abstractions)
1. `addCollider()` - 16 edges
2. `addZoneSetDressing()` - 16 edges
3. `repeated()` - 12 edges
4. `addSignpost()` - 5 edges
5. `animate()` - 5 edges
6. `makeLabelSprite()` - 4 edges
7. `addArchGate()` - 4 edges
8. `addBench()` - 4 edges
9. `addChalkboard()` - 4 edges
10. `addMarketStall()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `addLowPolyTree()` --calls--> `repeated()`  [EXTRACTED]
  src/main.ts → src/main.ts  _Bridges community 2 → community 3_
- `addSignpost()` --calls--> `repeated()`  [EXTRACTED]
  src/main.ts → src/main.ts  _Bridges community 2 → community 6_
- `addFountain()` --calls--> `addCollider()`  [EXTRACTED]
  src/main.ts → src/main.ts  _Bridges community 3 → community 1_
- `addSignpost()` --calls--> `addCollider()`  [EXTRACTED]
  src/main.ts → src/main.ts  _Bridges community 3 → community 6_
- `addZoneSetDressing()` --calls--> `addArchGate()`  [EXTRACTED]
  src/main.ts → src/main.ts  _Bridges community 2 → community 1_

## Communities

### Community 1 - "Community 1"
Cohesion: 0.25
Nodes (8): addBookStack(), addBroom(), addFenceLine(), addFountain(), addLantern(), addWaterStand(), addZoneGroundPatch(), addZoneSetDressing()

### Community 2 - "Community 2"
Cohesion: 0.29
Nodes (7): addArchGate(), addBench(), addChalkboard(), addMarketStall(), addSandalRack(), addSoftPath(), repeated()

### Community 3 - "Community 3"
Cohesion: 0.29
Nodes (7): addCollider(), addDonationBox(), addFlowerBed(), addLowPolyTree(), addPlanter(), addRamp(), addSmallHouse()

### Community 4 - "Community 4"
Cohesion: 0.4
Nodes (5): answerQuiz(), burstAt(), playPickupSound(), playTone(), updateAmbientSong()

### Community 5 - "Community 5"
Cohesion: 0.5
Nodes (4): animate(), checkOrbs(), updateCamera(), updateVehicle()

### Community 6 - "Community 6"
Cohesion: 0.5
Nodes (4): addBuilding(), addSignpost(), createQuestScene(), makeLabelSprite()

### Community 7 - "Community 7"
Cohesion: 0.67
Nodes (2): getUIElements(), mountApp()

## Knowledge Gaps
- **Thin community `Community 7`** (3 nodes): `dom.ts`, `getUIElements()`, `mountApp()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `addZoneSetDressing()` connect `Community 1` to `Community 0`, `Community 2`, `Community 3`, `Community 6`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `addCollider()` connect `Community 3` to `Community 0`, `Community 1`, `Community 2`, `Community 6`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `mountApp()` connect `Community 7` to `Community 0`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._