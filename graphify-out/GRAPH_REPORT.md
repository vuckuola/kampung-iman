# Graph Report - kampung-iman-webgl  (2026-06-14)

## Corpus Check
- 7 files · ~33,472 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 73 nodes · 146 edges · 7 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]

## God Nodes (most connected - your core abstractions)
1. `addZoneSetDressing()` - 16 edges
2. `addCollider()` - 16 edges
3. `CollisionSystem` - 15 edges
4. `repeated()` - 12 edges
5. `addCircleCollider()` - 9 edges
6. `addBoxCollider()` - 8 edges
7. `addSignpost()` - 6 edges
8. `addArchGate()` - 5 edges
9. `addBench()` - 5 edges
10. `addChalkboard()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `addLowPolyTree()` --calls--> `repeated()`  [EXTRACTED]
  src/main.ts → src/main.ts  _Bridges community 4 → community 3_
- `addBench()` --calls--> `repeated()`  [EXTRACTED]
  src/main.ts → src/main.ts  _Bridges community 4 → community 1_
- `addZoneSetDressing()` --calls--> `addArchGate()`  [EXTRACTED]
  src/main.ts → src/main.ts  _Bridges community 3 → community 1_
- `animate()` --calls--> `updateAmbientSong()`  [EXTRACTED]
  src/main.ts → src/main.ts  _Bridges community 5 → community 6_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.18
Nodes (4): CollisionSystem, isBoundary(), isBox(), isCircle()

### Community 1 - "Community 1"
Cohesion: 0.23
Nodes (12): addBench(), addBookStack(), addBoxCollider(), addBroom(), addChalkboard(), addDonationBox(), addFenceLine(), addLantern() (+4 more)

### Community 3 - "Community 3"
Cohesion: 0.39
Nodes (9): addArchGate(), addCircleCollider(), addCollider(), addFlowerBed(), addFountain(), addLowPolyTree(), addPlanter(), addRamp() (+1 more)

### Community 4 - "Community 4"
Cohesion: 0.38
Nodes (7): addBuilding(), addSignpost(), addSmallHouse(), addSoftPath(), createQuestScene(), makeLabelSprite(), repeated()

### Community 5 - "Community 5"
Cohesion: 0.4
Nodes (5): answerQuiz(), burstAt(), playPickupSound(), playTone(), updateAmbientSong()

### Community 6 - "Community 6"
Cohesion: 0.5
Nodes (4): animate(), checkOrbs(), updateCamera(), updateVehicle()

### Community 7 - "Community 7"
Cohesion: 0.67
Nodes (2): getUIElements(), mountApp()

## Knowledge Gaps
- **Thin community `Community 7`** (3 nodes): `dom.ts`, `getUIElements()`, `mountApp()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CollisionSystem` connect `Community 0` to `Community 2`?**
  _High betweenness centrality (0.377) - this node is a cross-community bridge._
- **Why does `addZoneSetDressing()` connect `Community 1` to `Community 2`, `Community 3`, `Community 4`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `addCollider()` connect `Community 3` to `Community 1`, `Community 2`, `Community 4`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._