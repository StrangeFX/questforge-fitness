import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { extname, join } from "node:path";
import { Script } from "node:vm";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const requiredWorkoutHeaders = [
  "workout_id",
  "workout_name",
  "movement_type",
  "visual_type",
  "experience_levels",
  "required_equipment",
  "environment",
  "intensity",
  "impact",
  "fatigue",
  "order_rank",
  "movement_pattern",
  "primary_muscles",
  "secondary_muscles",
  "goals",
  "tags",
  "duration_min",
  "prescription",
  "rep_range_min",
  "rep_range_max",
  "load_target",
  "training_style",
  "heavy_eligible",
  "rest",
  "progression",
  "regression",
  "contraindications",
  "avoid_with",
  "substitutions",
  "cue_1",
  "cue_2",
  "cue_3",
  "media_src"
];

const requiredClassKeys = ["barbarian", "monk", "ranger", "paladin", "rogue", "druid"];
const errors = [];
const warnings = [];

async function readText(relativePath) {
  return readFile(join(root, relativePath), "utf8");
}

async function assertFile(relativePath, label = relativePath) {
  try {
    await access(join(root, relativePath), constants.R_OK);
  } catch {
    errors.push(`Missing ${label}: ${relativePath}`);
  }
}

function parseTsv(text, fileName) {
  const rows = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter(row => row.trim().length > 0);
  if (rows.length === 0) {
    errors.push(`${fileName} is empty`);
    return { headers: [], records: [] };
  }

  const headers = rows.shift().split("\t").map(header => header.replace(/^\uFEFF/, ""));
  const records = rows.map((row, rowIndex) => {
    const values = row.split("\t");
    if (values.length !== headers.length) {
      warnings.push(`${fileName} row ${rowIndex + 2} has ${values.length} columns; expected ${headers.length}`);
    }
    return headers.reduce((record, header, index) => {
      record[header] = values[index] || "";
      return record;
    }, {});
  });

  return { headers, records };
}

function checkSyntax(source, relativePath) {
  try {
    new Script(source, { filename: relativePath });
  } catch (error) {
    errors.push(`${relativePath} has a syntax error: ${error.message}`);
  }
}

function findQuotedAssetPaths(source) {
  const paths = new Set();
  const pattern = /["']((?:assets|data|docs)\/[^"']+)["']/g;
  for (const match of source.matchAll(pattern)) {
    paths.add(match[1]);
  }
  return [...paths];
}

async function checkAssetReferences(relativePath) {
  const source = await readText(relativePath);
  await Promise.all(findQuotedAssetPaths(source).map(assetPath => assertFile(assetPath, `${relativePath} reference`)));
}

async function main() {
  await Promise.all([
    assertFile("index.html"),
    assertFile("app.js"),
    assertFile("styles.css"),
    assertFile("manifest.json"),
    assertFile("sw.js"),
    assertFile("data/workouts.tsv"),
    assertFile("data/class-mixes.tsv"),
    assertFile("data/class-preferences.tsv")
  ]);

  const [appSource, swSource, manifestSource, workoutsSource, mixesSource, preferencesSource] = await Promise.all([
    readText("app.js"),
    readText("sw.js"),
    readText("manifest.json"),
    readText("data/workouts.tsv"),
    readText("data/class-mixes.tsv"),
    readText("data/class-preferences.tsv")
  ]);

  checkSyntax(appSource, "app.js");
  checkSyntax(swSource, "sw.js");

  await Promise.all([
    checkAssetReferences("index.html"),
    checkAssetReferences("app.js"),
    checkAssetReferences("sw.js")
  ]);

  try {
    const manifest = JSON.parse(manifestSource);
    await Promise.all((manifest.icons || []).map(icon => assertFile(icon.src, "manifest icon")));
  } catch (error) {
    errors.push(`manifest.json is invalid JSON: ${error.message}`);
  }

  const workouts = parseTsv(workoutsSource, "data/workouts.tsv");
  requiredWorkoutHeaders.forEach(header => {
    if (!workouts.headers.includes(header)) errors.push(`data/workouts.tsv missing header: ${header}`);
  });

  const workoutIds = new Set();
  workouts.records.forEach((record, index) => {
    const id = record.workout_id;
    if (!id) errors.push(`data/workouts.tsv row ${index + 2} is missing workout_id`);
    if (workoutIds.has(id)) errors.push(`data/workouts.tsv duplicate workout_id: ${id}`);
    workoutIds.add(id);
    if (record.media_src) assertFile(record.media_src, `media for ${id}`);
    if (record.media_src && extname(record.media_src).toLowerCase() !== ".png") {
      warnings.push(`${id} media is not a PNG: ${record.media_src}`);
    }
  });

  const mixes = parseTsv(mixesSource, "data/class-mixes.tsv");
  const mixKeys = new Set(mixes.records.map(record => record.class_key));
  requiredClassKeys.forEach(classKey => {
    if (!mixKeys.has(classKey)) errors.push(`data/class-mixes.tsv missing class: ${classKey}`);
  });

  const preferences = parseTsv(preferencesSource, "data/class-preferences.tsv");
  const preferenceKeys = new Set(preferences.records.map(record => record.class_key));
  requiredClassKeys.forEach(classKey => {
    if (!preferenceKeys.has(classKey)) errors.push(`data/class-preferences.tsv missing class: ${classKey}`);
  });

  warnings.forEach(warning => console.warn(`Warning: ${warning}`));

  if (errors.length > 0) {
    errors.forEach(error => console.error(`Error: ${error}`));
    process.exitCode = 1;
    return;
  }

  console.log(`QuestForge check passed: ${workouts.records.length} workouts, ${requiredClassKeys.length} classes.`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
