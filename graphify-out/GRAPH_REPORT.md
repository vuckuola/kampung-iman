# Graph Report - kampung-iman-webgl  (2026-06-13)

## Corpus Check
- 4 files · ~32,430 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 48 nodes · 96 edges · 6 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]

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
- `addSmallHouse()` --calls--> `repeated()`  [EXTRACTED]
  src/main.ts → src/main.ts  _Bridges community 3 → community 2_
- `addSignpost()` --calls--> `repeated()`  [EXTRACTED]
  src/main.ts → src/main.ts  _Bridges community 3 → community 5_
- `addFountain()` --calls--> `addCollider()`  [EXTRACTED]
  src/main.ts → src/main.ts  _Bridges community 2 → community 1_
- `addSignpost()` --calls--> `addCollider()`  [EXTRACTED]
  src/main.ts → src/main.ts  _Bridges community 2 → community 5_
- `addZoneSetDressing()` --calls--> `addArchGate()`  [EXTRACTED]
  src/main.ts → src/main.ts  _Bridges community 3 → community 1_

## Communities

### Community 1 - "Community 1"
Cohesion: 0.25
Nodes (8): addBookStack(), addBroom(), addDonationBox(), addFenceLine(), addFountain(), addLantern(), addZoneGroundPatch(), addZoneSetDressing()

### Community 2 - "Community 2"
Cohesion: 0.29
Nodes (7): addCollider(), addFlowerBed(), addPlanter(), addRamp(), addSandalRack(), addSmallHouse(), addWaterStand()

### Community 3 - "Community 3"
Cohesion: 0.29
Nodes (7): addArchGate(), addBench(), addChalkboard(), addLowPolyTree(), addMarketStall(), addSoftPath(), repeated()

### Community 4 - "Community 4"
Cohesion: 0.4
Nodes (5): answerQuiz(), burstAt(), playPickupSound(), playTone(), updateAmbientSong()

### Community 5 - "Community 5"
Cohesion: 0.5
Nodes (4): addBuilding(), addSignpost(), createQuestScene(), makeLabelSprite()

### Community 6 - "Community 6"
Cohesion: 0.5
Nodes (4): animate(), checkOrbs(), updateCamera(), updateVehicle()

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `addZoneSetDressing()` connect `Community 1` to `Community 0`, `Community 2`, `Community 3`, `Community 5`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `addCollider()` connect `Community 2` to `Community 0`, `Community 1`, `Community 3`, `Community 5`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `repeated()` connect `Community 3` to `Community 0`, `Community 2`, `Community 5`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._