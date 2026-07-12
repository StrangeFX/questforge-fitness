# QuestForge Fitness

QuestForge Fitness is a local-first, RPG-inspired fitness planner. The app is currently a dependency-free PWA prototype with structured workout data, offline assets, local user profiles, daily workout generation, exercise logging, and guided exercise cards.

## Run Locally

From this folder:

```powershell
.\dev.ps1
```

Then open the local or LAN URL printed by the server.

Default port: `4177`

To choose a port:

```powershell
$env:PORT=4180; .\dev.ps1
```

If Node.js is installed and available on PATH, `npm run dev` also works.

## Validate

```powershell
.\check.ps1
```

The check script validates JavaScript syntax, manifest/service worker asset references, workout table headers, media paths, duplicate workout ids, and class table coverage.

## Current Structure

- `index.html`: app shell and dialogs.
- `app.js`: product logic, local users, onboarding, workout generation, logging, and rendering.
- `styles.css`: visual system.
- `data/workouts.tsv`: master exercise table.
- `data/class-mixes.tsv`: workout category proportions by class.
- `data/class-preferences.tsv`: class scoring preferences.
- `assets/`: app art and exercise images.
- `docs/`: requirements and backlog.
- `server.mjs`: local dev/static server.
- `scripts/check.mjs`: project validation.

## Development Direction

The next major step is to split `app.js` into modules while preserving behavior:

1. `src/storage.js` for user-scoped local storage.
2. `src/workouts.js` for table parsing and exercise selection.
3. `src/progression.js` for performance targets.
4. `src/render.js` for DOM rendering and events.
5. `src/app.js` as the startup coordinator.

After that, the app can move cleanly toward Capacitor/iOS packaging while keeping the same PWA surface for fast testing.
