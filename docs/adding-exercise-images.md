# Single Point Lesson — Add a demonstration image to an exercise

Wire a picture to any exercise so it shows on the guided card instead of the
"Demonstration image pending" placeholder.

- **File edited:** `data/workouts.tsv` (and optionally `sw.js`)
- **Format:** PNG · **Time:** ~5 min · **Covers:** all 120 exercises

## Steps

1. **Name and save the image as PNG.** Lowercase-with-hyphens, matching the
   exercise name. *Goblet Squat* → `goblet-squat.png`. Square-ish (≈1:1 to 4:3)
   sits best.

2. **Drop it into `assets/`.** Next to the existing exercise images. Its path
   from the project root becomes `assets/goblet-squat.png`.

3. **Link it in the exercise row.** In `data/workouts.tsv`, find the row by
   `workout_id` or `workout_name`, and put the path in the **last column**,
   `media_src` (the 33rd, tab-separated). The empty slot after the final tab is
   where it goes.

   ```
   before:  goblet_squat ⇥ Goblet Squat ⇥ …30 cols… ⇥ Brace tall. ⇥
   after:   goblet_squat ⇥ Goblet Squat ⇥ …30 cols… ⇥ Brace tall. ⇥ assets/goblet-squat.png
   ```

4. **Cache it for offline (recommended).** Add one line to the `assets` list in
   `sw.js` and bump the `cacheName` version so installed phones pick it up:

   ```js
   "./assets/goblet-squat.png",
   const cacheName = "questforge-fitness-alpha-v51";  // was v50
   ```

5. **Validate, then deploy.** Run `.\check.ps1`. A clean run confirms the path
   resolves and it's a PNG. Then commit and push — live on the hosted app in
   ~1 minute (locally it shows immediately).

## Expected result

- `QuestForge check passed: 120 workouts, 6 classes.`
- In the app: open the exercise card — the placeholder is replaced by your image.

## Watch out for

- **Case must match exactly.** `Goblet-Squat.png` referenced as
  `goblet-squat.png` works on Windows but breaks on the live site (GitHub Pages
  is case-sensitive). Keep everything lowercase.
- **PNG only.** The check prints `Warning: … is not a PNG` otherwise.
- **Path not found?** `Error: media for goblet_squat` means the filename/folder
  doesn't match a real file — check spelling and that it's in `assets/`.
- **Tabs, not spaces.** Don't add spaces or shift the other columns.

## Reference

`scripts/check.mjs` validates the media path; `app.js` renders it
(`exerciseMediaMarkup` — falls back to the placeholder when `media_src` is
empty). One image path per exercise.
