# India Mapping Quest — Version 1

A mobile-first UPSC India mapping atlas and geography quiz PWA.

## Run locally (easiest)

**Windows:** double-click `run-local.bat`.

**Mac/Linux:** open Terminal in this folder and run:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser. The first load needs an internet connection for Leaflet and the India state-boundary GeoJSON. Once loaded, the service worker caches the app shell and assets; the boundary GeoJSON is also stored locally by the app. Progress is saved in browser local storage.

## iPhone

For installation as an app, the site needs to be served over HTTPS (for example GitHub Pages). Open the HTTPS URL in Safari → Share → Add to Home Screen. The first visit should be online so map assets can be cached.

## Included in V1

- Explore: map with state/UT boundary layer (loaded from a public GeoJSON endpoint), river paths, lakes, national parks and physical geography markers.
- Learn: curated starter notes for 36 administrative units, 12 major rivers, 12 physical features, 10 lakes and 10 national parks.
- Play: state locator, river origins, capital matching, physical geography and mixed quickfire quizzes.
- Progress: XP, accuracy, streak, activity history and mistake notebook.
- Export progress as JSON.
- PWA manifest and service worker.

## Data notes and limitations

- Administrative boundaries are fetched from the public `udit-001/india-maps-data` GeoJSON repository via jsDelivr. The source repository says its map data is curated from public sources and advises users to verify it. This is a learning app, not an authoritative boundary reference.
- River courses in V1 are deliberately simplified schematic learning paths; they are not survey-grade hydrography. Origins, tributaries, termination and state coverage are concise study notes and should be cross-checked against standard UPSC sources.
- Some map layers are locator markers, not official protected-area or lake polygons.
- Offline support is best-effort after the first online visit. External map geometry and library caching depends on browser cache policy. A fully bundled offline geographic dataset and tile package is a later improvement.
- This first release is not a complete implementation of all 12 curriculum modules. Modules marked “Coming” are roadmap placeholders.

## Sources

- State boundary GeoJSON: https://github.com/udit-001/india-maps-data (repository README documents India-wide and state GeoJSON/TopoJSON resources; see its data disclaimer).
- River and basin datasets for a later high-accuracy release: National Water Data Portal / National Water Informatics Centre, Ministry of Jal Shakti: https://nwdp.nwic.gov.in/group/water-planning
- Leaflet: https://leafletjs.com/ (BSD-2-Clause).

## Publish to GitHub Pages

A GitHub Actions workflow is included at `.github/workflows/deploy.yml`.

1. Create a new GitHub repository named `india-mapping-quest` (public is simplest for Pages).
2. Upload the **contents** of this folder to the repository's `main` branch (including the hidden `.github` folder).
3. In the repository, open **Settings → Pages** and set the build/deployment source to **GitHub Actions**.
4. Open **Actions** and wait for the `Deploy India Mapping Quest` workflow to finish.
5. The app will be published at `https://<your-github-username>.github.io/india-mapping-quest/`.

If the repository is named differently, the published URL will use that repository name. Do not publish private study notes or personal data in a public repository.
