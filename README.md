# India Mapping Quest 🌏

A personal, offline-first game for learning UPSC physical geography and India's river/drainage system.

**What's inside**
- **Atlas** – tap any river, range, peak, pass, dam, city, glacier, lake, fall or landform; see tributaries (left/right bank), origin, mouth, states, cities & dams on it, and quiz yourself on it.
- **Quest** – 17 stages (Indus, Ganga, Brahmaputra, east/west-flowing rivers, ranges, peaks, passes, glaciers, plateaus, plains, islands, lakes, falls, dams, cities, concepts) with 1–3 stars.
- **Arcade** – Map Tap, Name It, Source Hunt, Quickfire, Left/Right, Order It, Match Pairs, True/False, Speed Round, Boss Rush, Review Due.
- **Learn** – notes, flashcards and mnemonic hooks.
- **Spaced repetition** (Leitner boxes), XP, levels, streaks, daily goal, badges, weak-spot tracking, backup export/import.

## Run
- Locally: `./run-local.sh` (or `run-local.bat`), or just open `index.html`.
- Deploy: push to `main`; the existing GitHub Pages workflow publishes the repo as-is (no build step).
- Works offline once loaded (service worker); installable as a PWA.

## Data & geometry
`data/*.js` hold the content. `tools/build_geo.py` regenerates `data/geo-*.js` from Natural Earth rivers and an India state-outline set. Geometry is schematic, for learning – not survey-accurate. Cross-check facts with NCERT/standard atlas.

Credits: Natural Earth (public domain), india-maps-data (udit-001), Leaflet 1.9.4.
