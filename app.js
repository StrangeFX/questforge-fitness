const profileKey = "questforge-fitness-profile";
const stateKey = "questforge-fitness-state";
const performanceKey = "questforge-fitness-performance";
const exerciseFeedbackKey = "questforge-fitness-exercise-feedback";
const onboardingKey = "questforge-fitness-onboarding-complete";
const usersKey = "questforge-fitness-users";
const activeUserKey = "questforge-fitness-active-user";
const ryanSharplesLegacyRecoveryKey = "questforge-fitness-ryan-sharples-legacy-recovery-v1";
const searchParams = new URLSearchParams(window.location.search);
const forceOnboarding = searchParams.get("setup") === "new";

const defaultProfile = {
  age: 39,
  height: 70,
  weight: 190,
  goal: "paladin"
};

const legacyGoalMap = {
  base: "paladin",
  "fat-loss": "rogue",
  muscle: "barbarian",
  endurance: "ranger"
};

const classPlans = {
  barbarian: {
    title: "Barbarian",
    focus: "Bodybuilding",
    image: "assets/barbarian-class.png",
    subtitle: "Heavy dumbbell work leads the quest, with enough cardio and mobility to keep the engine alive.",
    mix: { Strength: 50, Cardio: 20, Yoga: 15, Recovery: 15 },
    nutrition: { calorieShift: 200, proteinRate: 0.92 },
    week: [
      ["Mon", "Heavy dumbbell lower body", true],
      ["Tue", "Walk + mobility reset", true],
      ["Wed", "Upper body forge", true],
      ["Thu", "Easy cardio armor polish", false],
      ["Fri", "Full-body strength boss set", false],
      ["Sat", "Yoga recovery", false],
      ["Sun", "Weigh-in + meal prep", false]
    ],
    achievements: [["Rage Rep", "Complete a heavy strength day", true], ["Iron Hide", "Three strength sessions in a week", false]]
  },
  monk: {
    title: "Monk",
    focus: "Yoga and mobility",
    image: "assets/monk-class.png",
    subtitle: "Mobility, balance, breath, and control lead the quest while strength and cardio stay in support.",
    mix: { Strength: 20, Cardio: 15, Yoga: 50, Recovery: 15 },
    nutrition: { calorieShift: 0, proteinRate: 0.78 },
    week: [
      ["Mon", "Yoga flow + light carry", true],
      ["Tue", "Walk meditation", true],
      ["Wed", "Mobility strength circuit", true],
      ["Thu", "Long yoga hold practice", false],
      ["Fri", "Easy run/walk", false],
      ["Sat", "Balance and breath flow", false],
      ["Sun", "Recovery check-in", false]
    ],
    achievements: [["Still Mind", "Complete a breath-led session", true], ["Open Gate", "Three mobility days in a week", false]]
  },
  ranger: {
    title: "Ranger",
    focus: "Aerobic endurance",
    image: "assets/ranger-class.png",
    subtitle: "Walking, running, and zone-building lead the quest, backed by joint-protective strength and yoga.",
    mix: { Strength: 20, Cardio: 50, Yoga: 15, Recovery: 15 },
    nutrition: { calorieShift: 75, proteinRate: 0.8 },
    week: [
      ["Mon", "Run/walk intervals", true],
      ["Tue", "Strength for knees and hips", true],
      ["Wed", "Easy walk mileage", true],
      ["Thu", "Yoga mobility", false],
      ["Fri", "Tempo walk or easy jog", false],
      ["Sat", "Long outdoor quest", false],
      ["Sun", "Recovery and sleep check", false]
    ],
    achievements: [["Trail Sign", "Finish an interval session", true], ["Long Road", "Complete the weekly long walk", false]]
  },
  paladin: {
    title: "Paladin",
    focus: "Balanced strength",
    image: "assets/paladin-class.png",
    subtitle: "A noble mix of dumbbells, cardio, yoga, and recovery keeps every attribute moving upward.",
    mix: { Strength: 35, Cardio: 25, Yoga: 25, Recovery: 15 },
    nutrition: { calorieShift: 0, proteinRate: 0.84 },
    week: [
      ["Mon", "Dumbbell strength + walk", true],
      ["Tue", "Yoga mobility", true],
      ["Wed", "Run/walk intervals", true],
      ["Thu", "Strength circuit", false],
      ["Fri", "Long walk", false],
      ["Sat", "Yoga + optional jog", false],
      ["Sun", "Recovery check-in", false]
    ],
    achievements: [["Oath Kept", "Complete a balanced quest day", true], ["Shield Wall", "Hit all four pillars in a week", false]]
  },
  rogue: {
    title: "Rogue",
    focus: "Conditioning",
    image: "assets/rogue-class.png",
    subtitle: "Fast circuits, brisk cardio, and sharp movement lead the quest, with strength and mobility in the kit.",
    mix: { Strength: 30, Cardio: 35, Yoga: 15, Recovery: 20 },
    nutrition: { calorieShift: -250, proteinRate: 0.86 },
    week: [
      ["Mon", "Conditioning circuit", true],
      ["Tue", "Mobility and steps", true],
      ["Wed", "Fast walk intervals", true],
      ["Thu", "Dumbbell strength", false],
      ["Fri", "Core and yoga reset", false],
      ["Sat", "Outdoor stealth cardio", false],
      ["Sun", "Recovery token", false]
    ],
    achievements: [["Clean Escape", "Finish a conditioning circuit", true], ["Shadow Streak", "Five active days", false]]
  },
  druid: {
    title: "Druid",
    focus: "Recovery and longevity",
    image: "assets/druid-class.png",
    subtitle: "Walking, yoga, sleep, and gentle strength lead the quest so the body can keep adventuring for years.",
    mix: { Strength: 20, Cardio: 25, Yoga: 35, Recovery: 20 },
    nutrition: { calorieShift: 0, proteinRate: 0.8 },
    week: [
      ["Mon", "Easy walk + yoga", true],
      ["Tue", "Gentle strength", true],
      ["Wed", "Long walk", true],
      ["Thu", "Restorative flow", false],
      ["Fri", "Light full-body circuit", false],
      ["Sat", "Outdoor recovery quest", false],
      ["Sun", "Sleep and meal reset", false]
    ],
    achievements: [["Green Ward", "Complete a recovery-led day", true], ["Deep Roots", "Log recovery three times", false]]
  }
};

const milestones = [
  ["Week 1", "Choose class", true],
  ["Week 2", "Build rhythm", true],
  ["Week 3", "Train specialty", false],
  ["Week 4", "Boss week", false]
];

const achievements = [
  ["First Quest", "Completed your first guided day", true],
  ["Steel Habit", "Two strength days in one week", true],
  ["Quiet Engine", "90 minutes of easy cardio", true],
  ["Mobile Human", "Three yoga sessions", true],
  ["Protein Anchor", "Hit protein 5 days", false],
  ["Four Week Finisher", "Complete the class arc", false]
];

const mixLabels = {
  strength: "Strength",
  cardio: "Cardio",
  yoga: "Yoga",
  recovery: "Recovery"
};

const classGoalKeys = {
  barbarian: "bodybuilding",
  monk: "mobility",
  ranger: "endurance",
  paladin: "strength",
  rogue: "conditioning",
  druid: "longevity"
};

let workoutLibrary = [];
let classMixes = {};
let classPreferences = {};
let workoutLoadError = "";
const dailyPlannerVersion = 6;
const dailyRerollLimit = 2;

function loadJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function userScopedKey(key, userId = activeUserId) {
  return `${key}:${userId}`;
}

function createUserId() {
  return `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function ensureUsers() {
  let savedUsers = loadJson(usersKey, []);
  if (!Array.isArray(savedUsers) || savedUsers.length === 0) {
    savedUsers = [{
      id: createUserId(),
      name: "Adventurer",
      createdAt: new Date().toISOString()
    }];
    saveJson(usersKey, savedUsers);
  }

  let selectedUserId = localStorage.getItem(activeUserKey);
  if (!savedUsers.some(user => user.id === selectedUserId)) {
    selectedUserId = savedUsers[0].id;
    localStorage.setItem(activeUserKey, selectedUserId);
  }

  return { savedUsers, selectedUserId };
}

function migrateLegacyUserData(userId) {
  if (localStorage.getItem("questforge-fitness-user-migration-v1") === "true") return;
  [
    profileKey,
    stateKey,
    performanceKey,
    exerciseFeedbackKey,
    onboardingKey
  ].forEach(key => {
    const legacyValue = localStorage.getItem(key);
    const scopedKey = userScopedKey(key, userId);
    if (legacyValue !== null && localStorage.getItem(scopedKey) === null) {
      localStorage.setItem(scopedKey, legacyValue);
    }
  });
  localStorage.setItem("questforge-fitness-user-migration-v1", "true");
}

function loadUserJson(key, fallback) {
  return loadJson(userScopedKey(key), fallback);
}

function saveUserJson(key, value) {
  saveJson(userScopedKey(key), value);
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function mergeTodayLogEntries(targetLog, legacyLog, dateKey) {
  if (!legacyLog || typeof legacyLog !== "object") return false;
  let changed = false;

  Object.entries(legacyLog).forEach(([exerciseId, entries]) => {
    if (!Array.isArray(entries)) return;
    const sameDayEntries = entries.filter(entry => typeof entry?.date === "string" && entry.date.startsWith(dateKey));
    if (sameDayEntries.length === 0) return;

    const existingEntries = Array.isArray(targetLog[exerciseId]) ? targetLog[exerciseId] : [];
    const seen = new Set(existingEntries.map(entry => JSON.stringify(entry)));
    const recoveredEntries = sameDayEntries.filter(entry => !seen.has(JSON.stringify(entry)));
    if (recoveredEntries.length === 0) return;

    targetLog[exerciseId] = [...existingEntries, ...recoveredEntries].slice(-20);
    changed = true;
  });

  return changed;
}

function recoverRyanSharplesWorkoutEntriesFromLegacy() {
  const activeNames = [activeUser?.name, profile.name].filter(Boolean).map(name => name.trim().toLowerCase());
  if (!activeNames.includes("ryan sharples")) return;

  const dateKey = localDateKey();
  const recoveryMarker = userScopedKey(ryanSharplesLegacyRecoveryKey);
  const legacyState = loadJson(stateKey, null);
  const legacyPerformanceLog = loadJson(performanceKey, null);
  const legacyFeedbackLog = loadJson(exerciseFeedbackKey, null);
  let restoredState = false;
  let restoredPerformance = false;
  let restoredFeedback = false;

  if (legacyState?.dailySessions?.[dateKey]) {
    questState.dailySessions ||= {};
    const currentSession = questState.dailySessions[dateKey];
    const legacySession = legacyState.dailySessions[dateKey];
    if (!currentSession?.generatedExerciseIds?.length && legacySession.generatedExerciseIds?.length) {
      questState.dailySessions[dateKey] = legacySession;
      restoredState = true;
    }
  }

  const legacyCompleted = legacyState?.completedExercises?.[dateKey];
  if (Array.isArray(legacyCompleted) && legacyCompleted.length > 0) {
    questState.completedExercises ||= {};
    const currentCompleted = new Set(questState.completedExercises[dateKey] || []);
    const previousSize = currentCompleted.size;
    legacyCompleted.forEach(exerciseId => currentCompleted.add(exerciseId));
    if (currentCompleted.size !== previousSize) {
      questState.completedExercises[dateKey] = [...currentCompleted];
      restoredState = true;
    }
  }

  restoredPerformance = mergeTodayLogEntries(performanceLog, legacyPerformanceLog, dateKey);
  restoredFeedback = mergeTodayLogEntries(exerciseFeedbackLog, legacyFeedbackLog, dateKey);

  if (restoredState) saveUserJson(stateKey, questState);
  if (restoredPerformance) saveUserJson(performanceKey, performanceLog);
  if (restoredFeedback) saveUserJson(exerciseFeedbackKey, exerciseFeedbackLog);

  if (restoredState || restoredPerformance || restoredFeedback) {
    localStorage.setItem(recoveryMarker, JSON.stringify({
      date: dateKey,
      restoredState,
      restoredPerformance,
      restoredFeedback,
      recoveredAt: new Date().toISOString()
    }));
    console.info("QuestForge recovered Ryan Sharples workout entries from legacy storage.", {
      date: dateKey,
      restoredState,
      restoredPerformance,
      restoredFeedback
    });
  }
}

function normalizeList(value, fallback = []) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.length > 0) return [value];
  return fallback;
}

function parseTable(tableText) {
  const rows = tableText.replace(/^\uFEFF/, "").trim().split(/\r?\n/).filter(Boolean);
  const headers = rows.shift().split("\t").map(header => header.replace(/^\uFEFF/, ""));
  return rows.map(row => {
    const values = row.split("\t");
    return headers.reduce((item, header, index) => {
      item[header] = values[index] || "";
      return item;
    }, {});
  });
}

async function loadWorkouts() {
  workoutLoadError = "";
  const [workoutsResponse, mixesResponse, preferencesResponse] = await Promise.all([
    fetch("data/workouts.tsv", { cache: "no-cache" }),
    fetch("data/class-mixes.tsv", { cache: "no-cache" }),
    fetch("data/class-preferences.tsv", { cache: "no-cache" })
  ]);
  if (!workoutsResponse.ok || !mixesResponse.ok || !preferencesResponse.ok) {
    throw new Error("Workout tables failed to load");
  }

  workoutLibrary = parseTable(await workoutsResponse.text()).map(record => ({
    id: record.workout_id,
    name: record.workout_name,
    meta: record.prescription,
    movementType: record.movement_type,
    type: record.visual_type,
    experienceLevels: record.experience_levels.split(",").filter(Boolean),
    requiredEquipment: record.required_equipment.split(",").filter(Boolean),
    environment: record.environment.split(",").filter(Boolean),
    intensity: record.intensity,
    impact: record.impact,
    fatigue: record.fatigue,
    orderRank: Number(record.order_rank) || 5,
    movementPattern: record.movement_pattern,
    primaryMuscles: record.primary_muscles.split(",").filter(Boolean),
    secondaryMuscles: record.secondary_muscles.split(",").filter(Boolean),
    goals: record.goals.split(",").filter(Boolean),
    duration: Number(record.duration_min) || 0,
    tags: record.tags.split(",").filter(Boolean),
    rest: record.rest,
    progression: record.progression,
    regression: record.regression,
    repRangeMin: Number(record.rep_range_min) || null,
    repRangeMax: Number(record.rep_range_max) || null,
    loadTarget: record.load_target || "",
    trainingStyle: record.training_style || "",
    heavyEligible: record.heavy_eligible === "yes",
    contraindications: record.contraindications.split(",").filter(tag => tag && tag !== "none"),
    avoidWith: record.avoid_with.split(",").filter(tag => tag && tag !== "none"),
    substitutions: record.substitutions.split(",").filter(Boolean),
    cues: [record.cue_1, record.cue_2, record.cue_3].filter(Boolean),
    mediaSrc: record.media_src || ""
  })).map(workout => workout.id === "single_leg_balance" ? {
    ...workout,
    meta: "3 rounds each side: stand tall 5 seconds, reach and hold 5 seconds, return slowly.",
    rest: "20 to 30 seconds between sides",
    progression: "Add one round or hold the reach for 8 seconds.",
    regression: "Use fingertips on a wall or shorten the reach.",
    repRangeMin: 3,
    repRangeMax: 3,
    cues: [
      "Position 1: stand tall on one foot for 5 seconds, eyes forward, ribs stacked over hips.",
      "Position 2: hinge forward, reach arms long, lift the back leg, and hold for 5 seconds without twisting.",
      "Return: take 3 slow seconds to stand back up, then reset before the next rep."
    ],
    mediaSrc: "assets/single-leg-reach.png"
  } : workout);

  classMixes = parseTable(await mixesResponse.text()).reduce((mixes, row) => {
    mixes[row.class_key] = {
      strength: Number(row.strength) || 0,
      cardio: Number(row.cardio) || 0,
      yoga: Number(row.yoga) || 0,
      recovery: Number(row.recovery) || 0
    };
    return mixes;
  }, {});

  classPreferences = parseTable(await preferencesResponse.text()).reduce((preferences, row) => {
    preferences[row.class_key] = {
      preferredTags: row.preferred_tags.split(",").filter(tag => tag && tag !== "none"),
      avoidedTags: row.avoided_tags.split(",").filter(tag => tag && tag !== "none"),
      intensityBias: row.intensity_bias
    };
    return preferences;
  }, {});
}

function heightParts(totalInches) {
  const safeInches = Math.max(48, Math.min(90, Number(totalInches) || defaultProfile.height));
  return {
    feet: Math.floor(safeInches / 12),
    inches: safeInches % 12
  };
}

function heightFromParts(feet, inches, fallback = defaultProfile.height) {
  const parsedFeet = Number(feet);
  const parsedInches = Number(inches);
  const total = (Number.isFinite(parsedFeet) ? parsedFeet : 0) * 12 + (Number.isFinite(parsedInches) ? parsedInches : 0);
  return total >= 48 && total <= 90 ? total : fallback;
}

let { savedUsers: users, selectedUserId: activeUserId } = ensureUsers();
migrateLegacyUserData(activeUserId);
let activeUser = users.find(user => user.id === activeUserId) || users[0];

let profile = loadUserJson(profileKey, defaultProfile);
profile.goal = legacyGoalMap[profile.goal] || profile.goal || defaultProfile.goal;
let questState = loadUserJson(stateKey, { xp: 1240, streak: 5, completedToday: false });
questState.completedExercises ||= {};
questState.dailySessions ||= {};
questState.rerolls ||= {};
let performanceLog = loadUserJson(performanceKey, {});
let exerciseFeedbackLog = loadUserJson(exerciseFeedbackKey, {});

recoverRyanSharplesWorkoutEntriesFromLegacy();

let activeExerciseId = null;
let activeLibraryExerciseId = null;
let onboardingStep = 0;
let launchSplashDismissed = false;
let onboardingDraft = {
  name: activeUser?.name === "Adventurer" ? "" : (activeUser?.name || profile.name || ""),
  age: profile.age,
  height: profile.height,
  weight: profile.weight,
  goal: profile.goal,
  experience: profile.experience || "returning",
  equipment: normalizeList(profile.equipment, ["none", "dumbbells", "outdoor"]),
  painFlags: normalizeList(profile.painFlags),
  campaign: profile.campaign || "standard",
  milestone: profile.milestone || "consistency",
  nutritionMode: profile.nutritionMode || "recomp",
  readiness: profile.readiness || "steady",
  relics: profile.relics || ["apple-health", "withings-watch", "withings-scale"]
};

function currentPlan() {
  return classPlans[profile.goal] || classPlans[defaultProfile.goal];
}

function currentClassKey() {
  return classPlans[profile.goal] ? profile.goal : defaultProfile.goal;
}

function mixForClass(classKey) {
  const planMix = classPlans[classKey]?.mix || classPlans[defaultProfile.goal].mix;
  const dataMix = classMixes[classKey];
  if (!dataMix) return planMix;
  return Object.fromEntries(Object.entries(dataMix).map(([key, value]) => [mixLabels[key], value]));
}

function categorySlotsForMix(mix) {
  const entries = Object.entries(mix)
    .map(([name, value]) => ({ key: name.toLowerCase(), value }))
    .sort((a, b) => b.value - a.value);
  const slots = entries.map(entry => entry.key);
  if (entries[0]?.value >= 35) {
    slots.splice(1, 0, entries[0].key);
  }
  return slots;
}

function categorySlotsForClass(classKey) {
  const baseSlots = categorySlotsForMix(mixForClass(classKey));
  const readiness = profile.readiness || "steady";
  if (readiness === "strong") return baseSlots;
  if (readiness === "tired") {
    return ["recovery", "yoga", ...baseSlots.filter(slot => !["recovery", "yoga"].includes(slot))].slice(0, 4);
  }
  if (readiness === "sore") {
    return ["recovery", "yoga", "cardio", ...baseSlots.filter(slot => slot === "strength")].slice(0, 4);
  }
  return baseSlots.filter((slot, index) => !(index > 0 && slot === baseSlots[0])).slice(0, 4);
}

function userContext() {
  const experienceMap = { new: "beginner", returning: "intermediate", veteran: "advanced" };
  const equipment = new Set(["none", ...normalizeList(profile.equipment, ["dumbbells", "outdoor"])]);
  return {
    experience: experienceMap[profile.experience] || "intermediate",
    equipment,
    readiness: profile.readiness || "steady",
    painFlags: new Set(normalizeList(profile.painFlags)),
    hiddenExercises: new Set(profile.hiddenExercises || [])
  };
}

function equipmentAllowed(workout, context) {
  return workout.requiredEquipment.some(item => context.equipment.has(item));
}

function availabilityForWorkout(workout, context, preferences) {
  if (context.hiddenExercises.has(workout.id)) return "hidden";
  if (!equipmentAllowed(workout, context)) return "unavailable";
  if (!workout.experienceLevels.includes(context.experience)) return "conditional";
  if (workout.contraindications.some(flag => context.painFlags.has(flag))) return "unavailable";
  if ((context.readiness === "tired" || context.readiness === "sore") && workout.fatigue === "high") return "temporary";
  if (preferences.preferredTags.some(tag => workout.tags.includes(tag) || workout.goals.includes(tag))) return "preferred";
  return "available";
}

function strengthRepTierForClass(classKey) {
  if (classKey === "barbarian") return 0;
  if (["paladin", "rogue"].includes(classKey)) return 1;
  return 2;
}

function readinessRepShift(readiness) {
  if (readiness === "tired") return 1;
  if (readiness === "sore") return 2;
  return 0;
}

function strengthPrescriptionTier(classKey, readiness) {
  const tiers = [
    { range: [4, 6], label: "4-6 reps", load: "heavy", rest: "2 to 3 minutes", sets: 4 },
    { range: [6, 8], label: "6-8 reps", load: "moderately heavy", rest: "90 to 120 seconds", sets: 3 },
    { range: [8, 12], label: "8-12 reps", load: "moderate", rest: "60 to 90 seconds", sets: 3 },
    { range: [10, 15], label: "10-15 reps", load: "light to moderate", rest: "45 to 75 seconds", sets: 2 },
    { range: [12, 15], label: "12-15 easy reps", load: "light", rest: "45 to 60 seconds", sets: 2 }
  ];
  return tiers[Math.min(tiers.length - 1, strengthRepTierForClass(classKey) + readinessRepShift(readiness))];
}

function classStrengthIntent(classKey, readiness) {
  const base = {
    barbarian: "Growth-focused lifting: use challenging load, clean reps, and stop before form breaks.",
    paladin: "Balanced strength: use firm but controlled load that supports the whole routine.",
    rogue: "Sharp conditioning strength: use crisp reps and leave enough in reserve to stay quick.",
    monk: "Control-first strength: use smooth reps, alignment, and breath instead of chasing load.",
    ranger: "Durability strength: use repeatable reps that support walking and running volume.",
    druid: "Longevity strength: use comfortable reps that build capacity without strain."
  }[classKey] || "Class-tuned strength work.";
  if (readiness === "tired") return `${base} Low resources: drop load slightly and keep 2-3 reps in reserve.`;
  if (readiness === "sore") return `${base} Sore day: drop load meaningfully, move slowly, and stop if discomfort rises.`;
  return base;
}

function applyClassStrengthPrescription(workout, context, classKey) {
  if (workout.movementType !== "strength" || !workout.repRangeMin || !workout.repRangeMax) return workout;
  const tier = strengthPrescriptionTier(classKey, context.readiness);
  const eachSide = /each side/i.test(workout.meta);
  const hold = /hold/i.test(workout.meta);
  const prescription = hold
    ? workout.meta
    : `${tier.sets} sets x ${tier.label}${eachSide ? " each side" : ""}`;

  return {
    ...workout,
    meta: prescription,
    rest: tier.rest,
    progression: `When every set reaches the top of ${tier.label} cleanly, add the smallest available weight next time.`,
    regression: context.readiness === "sore"
      ? "Use bodyweight, lighter dumbbells, shorter range, or skip if pain changes your movement."
      : "Use lighter dumbbells, bodyweight, or a smaller range of motion.",
    repRangeMin: tier.range[0],
    repRangeMax: tier.range[1],
    loadTarget: tier.load,
    activePrescription: "class-strength-tuned",
    variationIntent: classStrengthIntent(classKey, context.readiness),
    experienceCue: experienceCueForWorkout(workout, context.experience)
  };
}

function applyClassPrescription(workout, context, classKey) {
  if (workout.id === "fast_walk_intervals") {
    return applyFastWalkIntervalPrescription(workout, context, classKey);
  }

  if (workout.id === "sleep_mobility_reset") {
    return applySleepMobilityResetPrescription(workout, context, classKey);
  }

  if (workout.movementType === "strength") {
    return applyClassStrengthPrescription(workout, context, classKey);
  }

  return applyUniversalExerciseVariation(workout, context, classKey);
}

function experienceCueForWorkout(workout, experience) {
  const cues = {
    beginner: {
      strength: "Use the easiest listed version and keep 2-3 clean reps in reserve.",
      cardio: "Keep the first round easy enough that the last round looks the same.",
      yoga: "Use smaller ranges and skip any shape that creates pinching or strain.",
      recovery: "Choose the shortest calming version and finish feeling settled."
    },
    intermediate: {
      strength: "Use the listed prescription and progress only when every rep stays clean.",
      cardio: "Use the listed work and recovery rhythm; finish challenged but repeatable.",
      yoga: "Use the listed flow or hold times while keeping breath smooth.",
      recovery: "Use the full listed reset and notice whether it improves readiness."
    },
    advanced: {
      strength: "Use the upper end of the range, slower tempo, or a harder variation if form stays sharp.",
      cardio: "Add pace, one round, or slightly shorter recovery only if repeat quality stays high.",
      yoga: "Add a round, longer holds, or more control without forcing range.",
      recovery: "Add time only if it improves sleep, soreness, or next-day readiness."
    }
  };
  return cues[experience]?.[workout.movementType] || cues.intermediate[workout.movementType] || cues.intermediate.recovery;
}

function classIntentForWorkout(workout, classKey) {
  const intents = {
    barbarian: {
      strength: "Build muscle and strength with clean reps, useful load, and enough reserve to recover.",
      cardio: "Support lifting capacity without draining the next strength session.",
      yoga: "Open the joints needed for strong squats, hinges, carries, and presses.",
      recovery: "Protect sleep and tissue recovery so heavy work can keep progressing."
    },
    monk: {
      strength: "Build control, alignment, balance, and joint ownership before chasing load.",
      cardio: "Practice rhythmic movement and breath control without unnecessary strain.",
      yoga: "Prioritize breath-led mobility, balance, and calm transitions.",
      recovery: "Use recovery work as a nervous-system skill, not just rest."
    },
    ranger: {
      strength: "Build durable hips, knees, feet, and trunk for walking and running volume.",
      cardio: "Build repeatable aerobic capacity and trail-ready endurance.",
      yoga: "Restore calves, hips, hamstrings, and spine for better locomotion.",
      recovery: "Keep the legs fresh enough to continue the journey tomorrow."
    },
    paladin: {
      strength: "Train balanced strength with enough control to support all four pillars.",
      cardio: "Build a steady engine without sacrificing mobility or strength.",
      yoga: "Maintain useful range and posture for a balanced weekly routine.",
      recovery: "Recover enough to keep the whole campaign consistent."
    },
    rogue: {
      strength: "Train efficient strength, core control, and quick repeatable output.",
      cardio: "Use crisp conditioning that feels sharp rather than sloppy.",
      yoga: "Restore range and control so quick work stays coordinated.",
      recovery: "Downshift quickly so high-output days do not become restless days."
    },
    druid: {
      strength: "Use strength work to preserve function, confidence, and longevity.",
      cardio: "Move at a sustainable pace that supports vitality and recovery.",
      yoga: "Favor gentle range, tissue comfort, and long-term movement quality.",
      recovery: "Use restoration as the main training effect."
    }
  };
  return intents[classKey]?.[workout.movementType] || intents.paladin[workout.movementType];
}

function applyUniversalExerciseVariation(workout, context, classKey) {
  return {
    ...workout,
    activePrescription: "class-experience-tuned",
    variationIntent: classIntentForWorkout(workout, classKey),
    experienceCue: experienceCueForWorkout(workout, context.experience)
  };
}

function fastWalkIntervalPlan(classKey, experience) {
  const plans = {
    barbarian: {
      beginner: ["4 rounds: 90 seconds powerful brisk walk, 2 minutes easy walk", "Support leg recovery. Hard means strong posture, not a sprint."],
      intermediate: ["5 rounds: 90 seconds powerful brisk walk, 2 minutes easy walk", "Keep effort muscular and controlled so lifting quality stays high."],
      advanced: ["6 rounds: 90 seconds powerful brisk walk, 90 seconds easy walk", "Push pace without turning this into a run."]
    },
    monk: {
      beginner: ["3 rounds: 60 seconds smooth brisk walk, 2 minutes easy walk", "Stay relaxed, nasal-breathing if possible, and keep stride quiet."],
      intermediate: ["4 rounds: 60 seconds smooth brisk walk, 2 minutes easy walk", "Use posture, breath, and rhythm as the main challenge."],
      advanced: ["5 rounds: 75 seconds smooth brisk walk, 90 seconds easy walk", "Move quickly without losing softness or control."]
    },
    ranger: {
      beginner: ["5 rounds: 2 minutes fast walk, 2 minutes easy walk", "Build aerobic range. Hard should still be repeatable."],
      intermediate: ["6 rounds: 2 minutes fast walk, 90 seconds easy walk", "Cover ground consistently across every interval."],
      advanced: ["8 rounds: 2 minutes fast walk, 90 seconds easy walk", "Hold the same pace on the final interval as the first."]
    },
    paladin: {
      beginner: ["4 rounds: 90 seconds brisk walk, 2 minutes easy walk", "Balanced effort: challenging, clean, and recoverable."],
      intermediate: ["5 rounds: 90 seconds brisk walk, 90 seconds easy walk", "Keep effort strong without borrowing from tomorrow."],
      advanced: ["6 rounds: 2 minutes brisk walk, 90 seconds easy walk", "Sustain form and breathing under moderate pressure."]
    },
    rogue: {
      beginner: ["6 rounds: 1 minute fast walk, 1 minute easy walk", "Short sharp efforts. Be quick, controlled, and repeatable."],
      intermediate: ["8 rounds: 1 minute fast walk, 1 minute easy walk", "Make each interval crisp without breaking stride."],
      advanced: ["10 rounds: 1 minute fast walk, 45 seconds easy walk", "High cadence, clean posture, no sloppy final rounds."]
    },
    druid: {
      beginner: ["3 rounds: 60 seconds comfortable brisk walk, 2 minutes easy walk", "Use this as circulation and energy, not punishment."],
      intermediate: ["4 rounds: 75 seconds comfortable brisk walk, 2 minutes easy walk", "Finish fresher than you started."],
      advanced: ["5 rounds: 90 seconds comfortable brisk walk, 90 seconds easy walk", "Stay below strain and protect tomorrow's recovery."]
    }
  };
  return plans[classKey]?.[experience] || plans.paladin.intermediate;
}

function applyFastWalkIntervalPrescription(workout, context, classKey) {
  const [intervals, intent] = fastWalkIntervalPlan(classKey, context.experience);
  return {
    ...workout,
    meta: `Warm up 5 minutes. ${intervals}. Cool down 3 minutes.`,
    rest: "Easy walk during recovery intervals.",
    progression: classKey === "ranger"
      ? "Add one interval when every round stays repeatable."
      : "Add one interval only if the final round still feels controlled.",
    regression: "Use one fewer interval or shorten hard efforts to 45-60 seconds.",
    activePrescription: "class-walk-intervals",
    variationIntent: intent,
    experienceCue: experienceCueForWorkout(workout, context.experience)
  };
}

function sleepMobilityResetPlan(classKey, experience) {
  const durations = {
    beginner: {
      total: "8 minutes",
      breath: "2 minutes",
      mobility: "4 minutes",
      downshift: "2 minutes"
    },
    intermediate: {
      total: "10 minutes",
      breath: "2 minutes",
      mobility: "6 minutes",
      downshift: "2 minutes"
    },
    advanced: {
      total: "12 minutes",
      breath: "3 minutes",
      mobility: "7 minutes",
      downshift: "2 minutes"
    }
  };
  const intents = {
    barbarian: "Downshift after hard training: release hips, back, and shoulders so heavy work does not steal sleep.",
    monk: "Use breath-led control: smooth transitions, long exhales, and no forced range.",
    ranger: "Reset walking and running tissues: calves, hips, hamstrings, and low back get priority.",
    paladin: "Balanced recovery: calm breathing, easy hips and spine, then a clear sleep cue.",
    rogue: "Turn off the engine: short holds, slow exhales, and a clean stop before restlessness ramps up.",
    druid: "Restoration first: make every position comfortable enough that the nervous system can settle."
  };
  return {
    ...(durations[experience] || durations.intermediate),
    intent: intents[classKey] || intents.paladin
  };
}

function applySleepMobilityResetPrescription(workout, context, classKey) {
  const plan = sleepMobilityResetPlan(classKey, context.experience);
  return {
    ...workout,
    meta: `${plan.total}: ${plan.breath} breathing, ${plan.mobility} gentle hips/spine, ${plan.downshift} stillness.`,
    rest: "No timed rest. Move slowly enough that breathing stays easy.",
    progression: "Add one minute only if sleep feels better and the sequence stays calming.",
    regression: "Do only breathing plus one comfortable position.",
    cues: [
      `Breathing: lie down or sit supported for ${plan.breath}; inhale gently and use a longer, slower exhale.`,
      `Mobility: alternate cat-cow, knees-to-chest, low lunge or supported hip stretch, and easy spinal rotation for ${plan.mobility}.`,
      `Downshift: finish with ${plan.downshift} of stillness, dim light, relaxed jaw, and no effort to stretch harder.`
    ],
    activePrescription: "sleep-mobility-reset",
    variationIntent: plan.intent,
    experienceCue: experienceCueForWorkout(workout, context.experience)
  };
}

function intensityScore(workout, bias) {
  if (!bias || bias === "medium") return workout.intensity === "medium" ? 1 : 0;
  if (bias === "high") return workout.intensity === "high" ? 2 : workout.intensity === "medium" ? 1 : 0;
  if (bias === "low") return workout.intensity === "low" ? 2 : workout.intensity === "medium" ? 1 : 0;
  return 0;
}

function seededNumber(input) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

function rerollVarietyScore(workout, options = {}) {
  if (!options.seed) return 0;
  return seededNumber(`${options.seed}:${workout.id}`) * (options.reroll ? 14 : 4);
}

function recentRotationPenalty(workout) {
  const currentDate = todayKey();
  const recentDates = Object.keys(questState.dailySessions || {})
    .filter(dateKey => dateKey < currentDate)
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 3);
  let penalty = 0;
  recentDates.forEach((dateKey, index) => {
    const recencyWeight = 3 - index;
    const recentExercises = (questState.dailySessions[dateKey]?.generatedExerciseIds || [])
      .map(workoutById)
      .filter(Boolean);
    if (recentExercises.some(exercise => exercise.id === workout.id)) {
      penalty -= 18 * recencyWeight;
    }
    if (recentExercises.some(exercise => exercise.movementPattern === workout.movementPattern)) {
      penalty -= 5 * recencyWeight;
    }
    const recentPrimaryMuscles = new Set(recentExercises.flatMap(exercise => exercise.primaryMuscles || []));
    const repeatedPrimaryMuscles = (workout.primaryMuscles || []).filter(muscle => recentPrimaryMuscles.has(muscle)).length;
    penalty -= repeatedPrimaryMuscles * 3 * recencyWeight;
  });
  return penalty;
}

function feedbackScore(workout) {
  const lastFeedback = lastExerciseFeedback(workout.id);
  if (!lastFeedback) return 0;

  let score = 0;
  if (Number(lastFeedback.comfort) <= 2) score -= 4;
  if (Number(lastFeedback.comfort) >= 4) score += 1;
  if (lastFeedback.difficulty === "too hard") score -= 5;
  if (lastFeedback.difficulty === "hard") score -= 2;
  if (["easy", "good"].includes(lastFeedback.difficulty)) score += 1;
  return score;
}

function scoreWorkout(workout, preferences, options = {}) {
  const preferred = preferences.preferredTags.filter(tag => workout.tags.includes(tag)).length * 3;
  const avoided = preferences.avoidedTags.filter(tag => workout.tags.includes(tag)).length * 4;
  const goalMatch = workout.goals.includes(preferences.primaryGoal) ? 4 : 0;
  const availabilityBonus = workout.availability === "preferred" ? 2 : workout.availability === "conditional" ? -1 : 0;
  return goalMatch + preferred + availabilityBonus + intensityScore(workout, preferences.intensityBias) + feedbackScore(workout) + recentRotationPenalty(workout) + rerollVarietyScore(workout, options) - avoided + workout.duration / 100;
}

function exercisesForClass(classKey, options = {}) {
  const context = userContext();
  const preferences = {
    ...(classPreferences[classKey] || { preferredTags: [], avoidedTags: [], intensityBias: "medium" }),
    primaryGoal: classGoalKeys[classKey]
  };
  const used = new Set();
  const usedPatterns = new Set();
  const excludedExerciseIds = new Set(options.excludeExerciseIds || []);
  return categorySlotsForClass(classKey).map(category => {
    const rankedCandidates = workoutLibrary
      .map(workout => ({ ...workout, availability: availabilityForWorkout(workout, context, preferences) }))
      .filter(workout => workout.movementType === category && !used.has(workout.id))
      .filter(workout => ["available", "preferred", "conditional"].includes(workout.availability))
      .filter(workout => !usedPatterns.has(workout.movementPattern) || category === "yoga" || category === "recovery")
      .sort((a, b) => scoreWorkout(b, preferences, options) - scoreWorkout(a, preferences, options));
    const candidates = rankedCandidates.filter(workout => !excludedExerciseIds.has(workout.id));
    const selected = candidates[0] || rankedCandidates[0] || workoutLibrary
      .map(workout => ({ ...workout, availability: availabilityForWorkout(workout, context, preferences) }))
      .find(workout => !used.has(workout.id) && ["available", "preferred", "conditional"].includes(workout.availability));
    if (selected) {
      used.add(selected.id);
      usedPatterns.add(selected.movementPattern);
    }
    return selected ? applyClassPrescription(selected, context, classKey) : selected;
  }).filter(Boolean).sort((a, b) => a.orderRank - b.orderRank);
}

function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateLabel(dateKey) {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });
}

function dailyPlanSignature() {
  const context = userContext();
  return JSON.stringify({
    classKey: currentClassKey(),
    readiness: context.readiness,
    experience: context.experience,
    equipment: [...context.equipment].sort(),
    painFlags: [...context.painFlags].sort(),
    hiddenExercises: [...context.hiddenExercises].sort()
  });
}

function rerollsUsedToday() {
  questState.rerolls ||= {};
  return Number(questState.rerolls[todayKey()]) || 0;
}

function rerollsRemainingToday() {
  return Math.max(0, dailyRerollLimit - rerollsUsedToday());
}

function workoutById(exerciseId) {
  return workoutLibrary.find(exercise => exercise.id === exerciseId);
}

function isSessionComplete(dateKey) {
  const session = questState.dailySessions?.[dateKey];
  if (!session?.generatedExerciseIds?.length) return false;
  const completed = new Set(questState.completedExercises[dateKey] || []);
  return session.generatedExerciseIds.every(exerciseId => completed.has(exerciseId));
}

function markDailySessionCompleteIfReady(dateKey) {
  const session = questState.dailySessions?.[dateKey];
  if (!session) return;
  if (isSessionComplete(dateKey)) {
    session.status = "complete";
    session.completedAt ||= new Date().toISOString();
  }
}

function ensureTodaySession() {
  const dateKey = todayKey();
  const signature = dailyPlanSignature();
  const existing = questState.dailySessions[dateKey];
  const stalePlannerSession = existing && existing.plannerVersion !== dailyPlannerVersion;
  let changed = false;

  if (!existing || existing.signature !== signature || stalePlannerSession) {
    const generatedExerciseIds = exercisesForClass(currentClassKey()).map(exercise => exercise.id);
    if (stalePlannerSession) {
      questState.completedExercises[dateKey] = [];
    }
    const completed = existing && !stalePlannerSession ? questState.completedExercises[dateKey] || [] : [];
    const mergedExerciseIds = [...new Set([...completed, ...generatedExerciseIds])].filter(workoutById);
    const now = new Date().toISOString();
    questState.dailySessions[dateKey] = {
      ...(!stalePlannerSession ? existing || {} : {}),
      date: dateKey,
      plannerVersion: dailyPlannerVersion,
      signature,
      classKey: currentClassKey(),
      readiness: profile.readiness || "steady",
      experience: userContext().experience,
      equipment: [...userContext().equipment].sort(),
      generatedExerciseIds: mergedExerciseIds,
      status: existing?.status === "complete" && mergedExerciseIds.every(id => completed.includes(id)) ? "complete" : "active",
      createdAt: !stalePlannerSession && existing?.createdAt || now,
      updatedAt: now
    };
    changed = true;
  }

  if (questState.lastSeenDate !== dateKey) {
    questState.previousSeenDate = questState.lastSeenDate || null;
    questState.lastSeenDate = dateKey;
    questState.completedToday = false;
    changed = true;
  }

  markDailySessionCompleteIfReady(dateKey);
  if (changed) saveUserJson(stateKey, questState);
  return questState.dailySessions[dateKey];
}

function exercisesForToday() {
  const session = ensureTodaySession();
  const context = userContext();
  return (session.generatedExerciseIds || [])
    .map(workoutById)
    .filter(Boolean)
    .map(exercise => ({
      ...applyClassPrescription(exercise, context, currentClassKey()),
      sessionDate: session.date
    }))
    .sort((a, b) => a.orderRank - b.orderRank);
}

function rerollTodayQuest() {
  if (rerollsRemainingToday() <= 0) return;

  const dateKey = todayKey();
  const session = ensureTodaySession();
  const completed = new Set(questState.completedExercises[dateKey] || []);
  const pendingExerciseIds = (session.generatedExerciseIds || []).filter(exerciseId => !completed.has(exerciseId));
  const seed = `${dateKey}:${currentClassKey()}:reroll-${rerollsUsedToday() + 1}:${Date.now()}`;
  const nextExerciseIds = exercisesForClass(currentClassKey(), {
    seed,
    reroll: true,
    excludeExerciseIds: pendingExerciseIds
  }).map(exercise => exercise.id);

  questState.rerolls ||= {};
  questState.rerolls[dateKey] = rerollsUsedToday() + 1;
  session.generatedExerciseIds = [...new Set([...completed, ...nextExerciseIds])].filter(workoutById);
  session.rerollSeed = seed;
  session.status = "active";
  session.completedAt = null;
  session.updatedAt = new Date().toISOString();
  questState.completedToday = false;

  saveUserJson(stateKey, questState);
  activeExerciseId = null;
  render();
}

function unresolvedPreviousSession() {
  const currentDate = todayKey();
  return Object.values(questState.dailySessions || {})
    .filter(session => session.date !== currentDate)
    .filter(session => session.status === "active")
    .filter(session => !session.rolloverResolvedAt)
    .filter(session => !isSessionComplete(session.date))
    .sort((a, b) => b.date.localeCompare(a.date))[0];
}

function recoverMisfiledRolloverCompletions() {
  const previousSession = unresolvedPreviousSession();
  if (!previousSession) return false;

  const currentDate = todayKey();
  const todayCompleted = new Set(questState.completedExercises[currentDate] || []);
  if (!todayCompleted.size) return false;

  const previousExerciseIds = new Set(previousSession.generatedExerciseIds || []);
  const misplacedExerciseIds = [...todayCompleted].filter(exerciseId => previousExerciseIds.has(exerciseId));
  if (!misplacedExerciseIds.length) return false;

  const previousCompleted = new Set(questState.completedExercises[previousSession.date] || []);
  misplacedExerciseIds.forEach(exerciseId => {
    previousCompleted.add(exerciseId);
    todayCompleted.delete(exerciseId);
  });

  questState.completedExercises[previousSession.date] = [...previousCompleted];
  questState.completedExercises[currentDate] = [...todayCompleted];

  const todaySession = questState.dailySessions[currentDate];
  const todaySessionIds = new Set(todaySession?.generatedExerciseIds || []);
  const todayLooksLikePriorQuest = todaySessionIds.size > 0
    && [...todaySessionIds].every(exerciseId => previousExerciseIds.has(exerciseId));
  if (todayLooksLikePriorQuest) {
    delete questState.dailySessions[currentDate];
  }

  markDailySessionCompleteIfReady(previousSession.date);
  saveUserJson(stateKey, questState);
  return true;
}

function completedExerciseIdsToday() {
  return new Set(questState.completedExercises[todayKey()] || []);
}

function exerciseHistory(exerciseId) {
  return performanceLog[exerciseId] || [];
}

function bestPerformance(history) {
  return history.reduce((best, entry) => {
    const score = Number(entry.weight) * Number(entry.reps);
    const bestScore = best ? Number(best.weight) * Number(best.reps) : -1;
    return score > bestScore ? entry : best;
  }, null);
}

function allowsRepCapOverflow(exercise) {
  const classKey = currentClassKey();
  return classKey === "ranger" && (exercise.goals.includes("endurance") || exercise.tags.includes("endurance"));
}

function repRangeLabel(exercise) {
  if (!exercise.repRangeMin || !exercise.repRangeMax) return "clean reps";
  return exercise.repRangeMin === exercise.repRangeMax
    ? `${exercise.repRangeMax} reps`
    : `${exercise.repRangeMin}-${exercise.repRangeMax} reps`;
}

function performanceTarget(exercise, last) {
  if (!last) return "First log: choose a clean, repeatable effort.";
  const lastReps = Number(last.reps);
  const nextWeight = Number(last.weight) + 5;
  const maxReps = Number(exercise.repRangeMax);
  const minReps = Number(exercise.repRangeMin) || maxReps;

  if (Number.isFinite(maxReps) && lastReps >= maxReps && !allowsRepCapOverflow(exercise)) {
    const range = minReps === maxReps ? `${maxReps} reps` : `${minReps}-${maxReps} reps`;
    return `Next goal: ${nextWeight} lb x ${range}.`;
  }

  const nextReps = lastReps + 1;
  if (Number.isFinite(maxReps) && nextReps <= maxReps) {
    return `Next goal: ${last.weight} lb x ${nextReps} reps. Top of range: ${repRangeLabel(exercise)}.`;
  }

  return `Next goal: ${last.weight} lb x ${nextReps} reps or ${nextWeight} lb x ${last.reps} reps.`;
}

function performanceSummaryMarkup(exercise) {
  if (exercise.movementType !== "strength") return "";
  const history = exerciseHistory(exercise.id);
  const last = history[history.length - 1];
  const best = bestPerformance(history);
  return `
    <div class="performance-panel" data-performance-panel="${exercise.id}">
      <div class="performance-summary">
        <span>Last: ${last ? `${last.weight} lb x ${last.reps}` : "No entry yet"}</span>
        <span>Best: ${best ? `${best.weight} lb x ${best.reps}` : "Start your record"}</span>
      </div>
      <p>${performanceTarget(exercise, last)}</p>
      <div class="performance-inputs">
        <label>Weight <input data-weight-for="${exercise.id}" type="number" min="0" step="5" inputmode="decimal" value="${last?.weight || ""}" placeholder="lb"></label>
        <label>Reps <input data-reps-for="${exercise.id}" type="number" min="1" step="1" inputmode="numeric" value="${last?.reps || ""}" placeholder="reps"></label>
        <button class="text-button log-performance" type="button" data-log-exercise="${exercise.id}">Log set</button>
      </div>
    </div>
  `;
}

function durationSummaryMarkup(exercise) {
  if (exercise.movementType !== "cardio") return "";
  const lastFeedback = lastExerciseFeedback(exercise.id);
  return `
    <div class="duration-panel">
      <div class="comfort-summary">${lastFeedback?.actualMinutes ? `Last completed: ${lastFeedback.actualMinutes} minutes` : "Log the actual time completed."}</div>
      <label>Actual minutes <input data-duration-for="${exercise.id}" type="number" min="0" max="300" step="1" inputmode="numeric" value="${lastFeedback?.actualMinutes || exercise.duration || ""}" placeholder="minutes"></label>
    </div>
  `;
}

function saveExercisePerformance(exerciseId) {
  const weight = Number(document.querySelector(`[data-weight-for="${exerciseId}"]`)?.value);
  const reps = Number(document.querySelector(`[data-reps-for="${exerciseId}"]`)?.value);
  if (!Number.isFinite(weight) || !Number.isFinite(reps) || reps <= 0 || weight < 0) return;

  const entry = {
    weight,
    reps,
    date: new Date().toISOString()
  };
  performanceLog[exerciseId] = [...exerciseHistory(exerciseId), entry].slice(-20);
  saveUserJson(performanceKey, performanceLog);
  render();
}

function lastExerciseFeedback(exerciseId) {
  const history = exerciseFeedbackLog[exerciseId] || [];
  return history[history.length - 1];
}

function exerciseMediaMarkup(exercise) {
  if (exercise.mediaSrc) {
    return `<img src="${exercise.mediaSrc}" alt="${exercise.name} demonstration">`;
  }
  return `<div class="exercise-media-placeholder"><span>Demonstration image pending</span></div>`;
}

function exerciseTypeName(type) {
  return mixLabels[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

function groupedExerciseLibrary() {
  return workoutLibrary.reduce((groups, exercise) => {
    groups[exercise.movementType] = [...(groups[exercise.movementType] || []), exercise];
    return groups;
  }, {});
}

function renderExerciseLibrary() {
  const library = document.getElementById("exerciseLibrary");
  if (!library) return;

  document.getElementById("libraryCount").textContent = `${workoutLibrary.length} known`;
  if (workoutLoadError) {
    library.innerHTML = `
      <article class="quest-preview">
        <strong>Exercise table could not load</strong>
        <p>${workoutLoadError}</p>
      </article>
    `;
    return;
  }

  const grouped = groupedExerciseLibrary();
  const order = ["strength", "cardio", "yoga", "recovery"];
  library.innerHTML = order.filter(type => grouped[type]?.length).map(type => `
    <section class="library-group">
      <div class="library-heading">
        <h4>${exerciseTypeName(type)}</h4>
        <span>${grouped[type].length}</span>
      </div>
      <div class="library-list">
        ${grouped[type].sort((a, b) => a.name.localeCompare(b.name)).map(exercise => {
          const displayExercise = applyClassPrescription(exercise, userContext(), currentClassKey());
          return `
            <article class="library-card ${activeLibraryExerciseId === exercise.id ? "expanded" : ""}" data-library-exercise="${exercise.id}" tabindex="0">
              <header>
                <div>
                  <h4>${displayExercise.name}</h4>
                  <p class="exercise-meta">${displayExercise.meta}</p>
                </div>
                <span class="expand-indicator">${activeLibraryExerciseId === exercise.id ? "Open" : "Tap"}</span>
              </header>
              <div class="library-tags">
                <span>${displayExercise.movementPattern}</span>
                <span>${displayExercise.intensity}</span>
                <span>${displayExercise.requiredEquipment.join(", ")}</span>
              </div>
              ${activeLibraryExerciseId === exercise.id ? expandedExerciseMarkup(displayExercise) : ""}
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `).join("");
}

function renderHeroStatusCheck() {
  const options = document.getElementById("heroStatusOptions");
  if (!options) return;

  const statusText = {
    strong: "Full quest. Higher-output work can appear.",
    steady: "Balanced quest. Normal mix and volume.",
    tired: "Low-resource quest. More recovery and mobility.",
    sore: "Soreness-aware quest. Gentle movement moves forward."
  };
  const current = profile.readiness || "steady";
  document.getElementById("statusNudge").textContent = statusText[current];
  options.innerHTML = [
    ["strong", "Battle-ready"],
    ["steady", "Steady"],
    ["tired", "Low resources"],
    ["sore", "Sore"]
  ].map(([value, label]) => `
    <button type="button" class="${current === value ? "selected" : ""}" data-hero-status="${value}">
      ${label}
    </button>
  `).join("");
}

function expandedExerciseMarkup(exercise) {
  const lastFeedback = lastExerciseFeedback(exercise.id);
  const prescriptionNote = exercise.activePrescription === "barbarian-heavy"
    ? `<div class="prescription-note"><strong>Barbarian heavy set</strong><span>Choose a load that makes 4-6 clean reps challenging. Stop before form breaks.</span></div>`
    : exercise.activePrescription === "class-strength-tuned"
      ? `<div class="prescription-note"><strong>${currentPlan().title} strength tuning</strong><span>${exercise.variationIntent}</span></div>`
    : exercise.activePrescription === "class-walk-intervals"
      ? `<div class="prescription-note"><strong>${currentPlan().title} interval tuning</strong><span>${exercise.variationIntent}</span></div>`
    : exercise.activePrescription === "sleep-mobility-reset"
      ? `<div class="prescription-note"><strong>${currentPlan().title} recovery reset</strong><span>${exercise.variationIntent}</span></div>`
    : exercise.activePrescription === "class-experience-tuned"
      ? `<div class="prescription-note"><strong>${currentPlan().title} ${exerciseTypeName(exercise.movementType).toLowerCase()} focus</strong><span>${exercise.variationIntent}</span></div>`
    : "";
  const experienceNote = exercise.experienceCue
    ? `<div class="prescription-note secondary-note"><strong>${userContext().experience} target</strong><span>${exercise.experienceCue}</span></div>`
    : "";
  return `
    <div class="exercise-detail">
      <div class="exercise-media">${exerciseMediaMarkup(exercise)}</div>
      ${prescriptionNote}
      ${experienceNote}
      <ul class="guidance">${exercise.cues.map(cue => `<li>${cue}</li>`).join("")}</ul>
      <div class="exercise-rules">
        <span>Rest: ${exercise.rest}</span>
        <span>Progress: ${exercise.progression}</span>
        <span>Scale: ${exercise.regression}</span>
      </div>
      ${performanceSummaryMarkup(exercise)}
      ${durationSummaryMarkup(exercise)}
      <div class="comfort-panel">
        <div class="comfort-summary">${lastFeedback ? `Last comfort: ${lastFeedback.comfort}/5, ${lastFeedback.difficulty}` : "Log comfort after the set."}</div>
        <label>Comfort <input data-comfort-for="${exercise.id}" type="range" min="1" max="5" value="${lastFeedback?.comfort || 4}"></label>
        <label>Difficulty
          <select data-difficulty-for="${exercise.id}">
            ${["easy", "good", "hard", "too hard"].map(value => (
              `<option value="${value}" ${lastFeedback?.difficulty === value ? "selected" : ""}>${value}</option>`
            )).join("")}
          </select>
        </label>
        <label>Notes <input data-notes-for="${exercise.id}" type="text" value="${lastFeedback?.notes || ""}" placeholder="Pain, form, confidence"></label>
        <button class="primary-button exercise-done" type="button" data-done-exercise="${exercise.id}" data-session-date="${exercise.sessionDate || todayKey()}">Done</button>
      </div>
    </div>
  `;
}

function saveExerciseFeedback(exerciseId, sessionDate = todayKey()) {
  const comfort = Number(document.querySelector(`[data-comfort-for="${exerciseId}"]`)?.value) || 3;
  const difficulty = document.querySelector(`[data-difficulty-for="${exerciseId}"]`)?.value || "good";
  const notes = document.querySelector(`[data-notes-for="${exerciseId}"]`)?.value || "";
  const actualMinutesInput = document.querySelector(`[data-duration-for="${exerciseId}"]`)?.value;
  const actualMinutes = actualMinutesInput === undefined || actualMinutesInput === "" ? null : Number(actualMinutesInput);
  const entry = {
    comfort,
    difficulty,
    notes,
    actualMinutes: Number.isFinite(actualMinutes) ? actualMinutes : null,
    done: true,
    date: new Date().toISOString()
  };
  exerciseFeedbackLog[exerciseId] = [...(exerciseFeedbackLog[exerciseId] || []), entry].slice(-20);
  saveUserJson(exerciseFeedbackKey, exerciseFeedbackLog);
  const completed = new Set(questState.completedExercises[sessionDate] || []);
  completed.add(exerciseId);
  questState.completedExercises[sessionDate] = [...completed];
  markDailySessionCompleteIfReady(sessionDate);
  saveUserJson(stateKey, questState);
  activeExerciseId = null;
  activeLibraryExerciseId = null;
  render();
}

function estimateNutrition(p) {
  const plan = currentPlan();
  const weightKg = p.weight / 2.20462;
  const heightCm = p.height * 2.54;
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * p.age + 5;
  const maintenance = Math.round((bmr * 1.45) / 25) * 25;
  const calories = maintenance + plan.nutrition.calorieShift;
  return {
    calories,
    protein: Math.round(p.weight * plan.nutrition.proteinRate),
    fiber: Math.max(28, Math.round(calories / 1000 * 14)),
    water: (p.weight * 0.016).toFixed(1)
  };
}

function motionMarkup(type) {
  return `<div class="motion ${type}" aria-label="Looping movement animation"><div class="figure"></div>${type === "lift" ? '<div class="bar"></div>' : ""}</div>`;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function render() {
  recoverMisfiledRolloverCompletions();
  const previousSession = unresolvedPreviousSession();
  const plan = currentPlan();
  const completed = completedExerciseIdsToday();
  const exercises = exercisesForToday().filter(exercise => !completed.has(exercise.id));
  const nutrition = estimateNutrition(profile);

  const userName = activeUser?.name || profile.name || "Adventurer";
  const isReturning = questState.xp > 0 || questState.streak > 0 || questState.completedToday;
  const activeUserLabel = document.getElementById("activeUserName");
  if (activeUserLabel) activeUserLabel.textContent = userName;
  const levelValue = `Level ${Math.floor(questState.xp / 500) + 1}`;
  const streakValue = `${questState.streak} days`;
  const xpValue = `${questState.xp.toLocaleString()} XP`;

  // Home (Quest Board) — every value bound to real state.
  const dayActivities = exercisesForToday();
  const totalActivities = dayActivities.length;
  const doneActivities = Math.max(0, totalActivities - exercises.length);
  const relicCount = Array.isArray(profile.relics) ? profile.relics.length : 3;
  setText("homeStreakCount", questState.streak > 0 ? `${questState.streak}-Day Streak` : "Start your streak");
  setText("homeQuestTitle", `${plan.title} Path`);
  setText("homeQuestMeta", `${plan.focus} · ${totalActivities} ${totalActivities === 1 ? "activity" : "activities"}`);
  setText("homeQuestXp", "+180 XP");
  setText("homeQuestCount", `${doneActivities}/${totalActivities} done`);
  setText("homeTotalXp", questState.xp.toLocaleString());
  setText("homeRelicCount", String(relicCount));

  // Workout page
  setText("goalTitle", `${plan.title} Path`);
  setText("goalSubtitle", plan.subtitle);
  setText("classRole", `${plan.title} Training Mix`);
  setText("classFocus", plan.focus);
  setText("xpValue", xpValue);
  setText("streakValue", streakValue);
  setText("levelValue", levelValue);
  document.getElementById("calorieTarget").textContent = `${nutrition.calories.toLocaleString()} kcal`;
  document.getElementById("proteinValue").textContent = `${nutrition.protein}g`;
  document.getElementById("fiberValue").textContent = `${nutrition.fiber}g`;
  document.getElementById("waterValue").textContent = `${nutrition.water}L`;
  document.getElementById("completeWorkout").textContent = isSessionComplete(todayKey()) ? "Quest complete" : "Complete quest";
  const rerollsRemaining = rerollsRemainingToday();
  document.getElementById("rerollCount").textContent = rerollsRemaining;
  document.getElementById("rerollQuest").disabled = rerollsRemaining <= 0;
  document.getElementById("rerollQuest").title = rerollsRemaining > 0
    ? `${rerollsRemaining} reroll${rerollsRemaining === 1 ? "" : "s"} remaining today`
    : "No rerolls remaining today";

  document.getElementById("classMix").innerHTML = classMixMarkup(mixForClass(currentClassKey()));

  document.getElementById("exerciseList").innerHTML = exercises.length ? exercises.map(exercise => `
    <article class="exercise-card ${activeExerciseId === exercise.id ? "expanded" : ""}" data-exercise-card="${exercise.id}" tabindex="0">
      <header>
        <div>
          <h4>${exercise.name}</h4>
          <p class="exercise-meta">${exercise.meta}</p>
        </div>
        <span class="expand-indicator">${activeExerciseId === exercise.id ? "Open" : "Tap"}</span>
      </header>
      ${activeExerciseId === exercise.id ? expandedExerciseMarkup(exercise) : ""}
    </article>
  `).join("") : `
    <article class="quest-preview">
      <strong>Quest cleared</strong>
      <p>All generated activities are complete for today. Change Hero Status Check if you want QuestForge to offer a different remaining path.</p>
    </article>
  `;

  document.getElementById("weekGrid").innerHTML = plan.week.map(day => `
    <article class="day-card ${day[2] ? "complete" : ""}">
      <strong>${day[0]}</strong>
      <span>${day[1]}</span>
      <div class="check" ${day[2] ? 'aria-label="Complete"' : 'aria-hidden="true"'}>${day[2] ? "✓" : ""}</div>
    </article>
  `).join("");
  document.getElementById("weeklyScore").textContent = `${plan.week.filter(day => day[2]).length} of ${plan.week.length} complete`;

  document.getElementById("milestoneTrack").innerHTML = milestones.map(item => `
    <article class="milestone ${item[2] ? "done" : ""}">
      <strong>${item[0]}</strong>
      <span>${item[1]}</span>
    </article>
  `).join("");

  document.getElementById("achievementGrid").innerHTML = [...achievements, ...plan.achievements].map(item => `
    <article class="achievement ${item[2] ? "" : "locked"}">
      <div class="badge"></div>
      <div><strong>${item[0]}</strong><span>${item[1]}</span></div>
    </article>
  `).join("");

  renderHeroStatusCheck();
  renderExerciseLibrary();
  if (previousSession) openRolloverDialog(previousSession);
}

function selectedClassPlan() {
  return classPlans[onboardingDraft.goal] || classPlans[defaultProfile.goal];
}

function classKeys() {
  return Object.keys(classPlans);
}

function classMixMarkup(mix) {
  return Object.entries(mix).map(([name, value]) => `
    <article class="mix-row">
      <div><strong>${name}</strong><span>${value}%</span></div>
      <div class="mix-bar"><i style="width:${value}%"></i></div>
    </article>
  `).join("");
}

function cycleClass(direction) {
  const keys = classKeys();
  const currentIndex = Math.max(0, keys.indexOf(onboardingDraft.goal));
  const nextIndex = (currentIndex + direction + keys.length) % keys.length;
  onboardingDraft.goal = keys[nextIndex];
  renderOnboarding();
}

const onboardingScreens = [
  {
    title: "Begin Your Quest",
    eyebrow: "Welcome",
    body: "Turn workouts, walks, yoga, nutrition, and recovery into a guided campaign. We will build your starting character, then hand you today's first quest.",
    render: () => `
      <label class="onboarding-name-field">Character name <input data-onboard-input="name" type="text" maxlength="32" placeholder="Choose a hero name" value="${escapeHtml(onboardingDraft.name || "")}"></label>
      <div class="quest-preview">
        <strong>How this maps to fitness</strong>
        <ul>
          <li>Class = your training emphasis</li>
          <li>Attributes = your starting biometrics and gear</li>
          <li>Relics = health data sources</li>
          <li>Quest = today's workout</li>
        </ul>
      </div>
    `
  },
  {
    title: "Choose Your Class",
    eyebrow: "Character creation",
    body: "Pick the hero you are building. Every class still trains strength, cardio, mobility, and recovery, but the proportions shift.",
    render: () => {
      const plan = selectedClassPlan();
      return `
      <div class="class-carousel">
        <div class="class-art-frame">
          <img src="${plan.image}" alt="${plan.title} class art">
        </div>
        <div class="class-carousel-copy">
          <div class="class-carousel-title">
            <button class="class-cycle" type="button" data-class-cycle="-1" aria-label="Previous class">Prev</button>
            <div>
              <strong>${plan.title}</strong>
              <span>${plan.focus}</span>
            </div>
            <button class="class-cycle" type="button" data-class-cycle="1" aria-label="Next class">Next</button>
          </div>
          <p>${plan.subtitle}</p>
          <div class="mix-grid compact-mix">${classMixMarkup(mixForClass(onboardingDraft.goal))}</div>
        </div>
      </div>
      <div class="class-chip-row">
        ${Object.entries(classPlans).map(([key, classPlan]) => `
          <button class="class-chip ${onboardingDraft.goal === key ? "selected" : ""}" data-onboard-set="goal" data-value="${key}">
            ${classPlan.title}
          </button>
        `).join("")}
      </div>
    `;
    }
  },
  {
    title: "Set Starting Attributes",
    eyebrow: "Character sheet",
    body: "These stats tune calorie estimates, protein targets, and the difficulty of your first campaign.",
    render: () => {
      const height = heightParts(onboardingDraft.height);
      return `
        <div class="attribute-grid">
          <label>Age <input data-onboard-input="age" type="number" min="13" max="100" value="${onboardingDraft.age}"></label>
          <div class="height-field">
            <span>Height</span>
            <label><input data-onboard-height="feet" type="number" min="4" max="7" value="${height.feet}"><span>ft</span></label>
            <label><input data-onboard-height="inches" type="number" min="0" max="11" value="${height.inches}"><span>in</span></label>
          </div>
          <label>Weight <input data-onboard-input="weight" type="number" min="80" max="500" value="${onboardingDraft.weight}"></label>
        </div>
        <div class="choice-grid">
          ${[
            ["new", "New adventurer", "Keep quests shorter and technique-focused."],
            ["returning", "Returning hero", "Balanced difficulty with room to progress."],
            ["veteran", "Veteran", "More volume and harder intervals."]
          ].map(([value, label, text]) => `
            <button class="choice-card ${onboardingDraft.experience === value ? "selected" : ""}" data-onboard-set="experience" data-value="${value}">
              <strong>${label}</strong><span>${text}</span>
            </button>
          `).join("")}
        </div>
      `;
    }
  },
  {
    title: "Choose Campaign Pace",
    eyebrow: "Quest schedule",
    body: "Pick how often QuestForge should ask for real effort. Recovery days still count as smart campaign play.",
    render: () => `
      <div class="choice-grid">
        ${[
          ["light", "Light campaign", "3 focused days per week."],
          ["standard", "Standard campaign", "4-5 days with a healthy mix."],
          ["heroic", "Heroic campaign", "6 days, including short recovery quests."],
          ["micro", "Daily micro-quests", "Small daily actions to protect momentum."]
        ].map(([value, label, text]) => `
          <button class="choice-card ${onboardingDraft.campaign === value ? "selected" : ""}" data-onboard-set="campaign" data-value="${value}">
            <strong>${label}</strong><span>${text}</span>
          </button>
        `).join("")}
      </div>
    `
  },
  {
    title: "Set Training Guardrails",
    eyebrow: "Eligibility filters",
    body: "Tell QuestForge what is available and what should be avoided today. These choices affect exercise availability before scoring begins.",
    render: () => `
      <div class="relic-grid">
        ${[
          ["none", "Bodyweight", "No equipment"],
          ["dumbbells", "Dumbbells", "Loaded strength"],
          ["bands", "Bands", "Portable resistance"],
          ["bench", "Bench", "Step or press support"],
          ["cardio_machine", "Cardio machine", "Bike, rower, elliptical"],
          ["bike", "Bike", "Indoor or outdoor cycling"],
          ["mobility_tools", "Mobility tools", "Foam roller or blocks"],
          ["outdoor", "Outdoor access", "Walking or running"]
        ].map(([value, label, text]) => `
          <button class="relic-choice ${onboardingDraft.equipment.includes(value) ? "selected" : ""}" data-onboard-toggle="equipment" data-value="${value}">
            <strong>${label}</strong><span>${text}</span>
          </button>
        `).join("")}
      </div>
      <div class="choice-grid">
        ${[
          ["knee_pain", "Knee sensitivity", "Avoid or scale knee-stress work."],
          ["shoulder_pain", "Shoulder sensitivity", "Avoid painful pressing and overhead work."],
          ["low_back_pain", "Low-back sensitivity", "Avoid heavy hinging or rowing fatigue."],
          ["wrist_pain", "Wrist sensitivity", "Avoid loaded wrist extension."],
          ["balance_limits", "Balance limits", "Prefer supported stable options."]
        ].map(([value, label, text]) => `
          <button class="choice-card ${onboardingDraft.painFlags.includes(value) ? "selected" : ""}" data-onboard-toggle="painFlags" data-value="${value}">
            <strong>${label}</strong><span>${text}</span>
          </button>
        `).join("")}
      </div>
    `
  },
  {
    title: "Connect Your Relics",
    eyebrow: "Data sources",
    body: "These are prototype toggles for now. Later they become HealthKit and Withings permissions.",
    render: () => `
      <div class="relic-grid">
        ${[
          ["apple-health", "Adventurer's Log", "Apple Health"],
          ["withings-watch", "Vitality Amulet", "Withings watch"],
          ["withings-scale", "Oracle Scale", "Withings scale"]
        ].map(([value, label, text]) => `
          <button class="relic-choice ${onboardingDraft.relics.includes(value) ? "selected" : ""}" data-onboard-toggle="relics" data-value="${value}">
            <strong>${label}</strong><span>${text}</span>
          </button>
        `).join("")}
      </div>
    `
  },
  {
    title: "Set First Milestone",
    eyebrow: "Campaign arc",
    body: "Your first four weeks should have one clean win condition.",
    render: () => `
      <div class="choice-grid">
        ${[
          ["consistency", "Forge consistency", "Build the habit before chasing numbers."],
          ["strength", "Gain strength", "Make dumbbell work the measurable anchor."],
          ["endurance", "Extend the trail", "Walk or run farther with less strain."],
          ["mobility", "Restore range", "Move better and feel less stiff."],
          ["recovery", "Recover better", "Improve sleep, soreness, and readiness."]
        ].map(([value, label, text]) => `
          <button class="choice-card ${onboardingDraft.milestone === value ? "selected" : ""}" data-onboard-set="milestone" data-value="${value}">
            <strong>${label}</strong><span>${text}</span>
          </button>
        `).join("")}
      </div>
    `
  },
  {
    title: "Pack Provisions",
    eyebrow: "Nutrition pact",
    body: "Choose the food strategy that supports the campaign without turning the app into a spreadsheet.",
    render: () => `
      <div class="choice-grid">
        ${[
          ["maintain", "Maintain", "Hold steady and fuel performance."],
          ["cut", "Steady cut", "Small deficit, high protein, no drama."],
          ["gain", "Lean gain", "Small surplus for strength and muscle."],
          ["recomp", "Recomposition", "Protein, training, and slow body change."]
        ].map(([value, label, text]) => `
          <button class="choice-card ${onboardingDraft.nutritionMode === value ? "selected" : ""}" data-onboard-set="nutritionMode" data-value="${value}">
            <strong>${label}</strong><span>${text}</span>
          </button>
        `).join("")}
      </div>
    `
  },
  {
    title: "First Quest Preview",
    eyebrow: "Campaign begins",
    body: "Here is the quest waiting for you after setup.",
    render: () => {
      const plan = selectedClassPlan();
      const exercises = exercisesForClass(onboardingDraft.goal);
      return `
        <div class="quest-preview">
          <strong>${plan.title} Path - ${plan.focus}</strong>
          <p>${plan.subtitle}</p>
          <ul>
            ${exercises.map(exercise => `<li>${exercise.name} - ${exercise.meta}</li>`).join("")}
          </ul>
        </div>
      `;
    }
  }
];

function bindOnboardingControls() {
  document.querySelectorAll("[data-onboard-set]").forEach(button => {
    button.addEventListener("click", () => {
      onboardingDraft[button.dataset.onboardSet] = button.dataset.value;
      renderOnboarding();
    });
  });

  document.querySelectorAll("[data-onboard-toggle]").forEach(button => {
    button.addEventListener("click", () => {
      const key = button.dataset.onboardToggle;
      const value = button.dataset.value;
      const values = new Set(onboardingDraft[key]);
      if (values.has(value)) {
        values.delete(value);
      } else {
        values.add(value);
      }
      onboardingDraft[key] = [...values];
      renderOnboarding();
    });
  });

  document.querySelectorAll("[data-onboard-input]").forEach(input => {
    input.addEventListener("input", () => {
      const key = input.dataset.onboardInput;
      onboardingDraft[key] = key === "name" ? input.value : (Number(input.value) || onboardingDraft[key]);
    });
  });

  document.querySelectorAll("[data-onboard-height]").forEach(input => {
    input.addEventListener("input", () => {
      const feet = document.querySelector('[data-onboard-height="feet"]').value;
      const inches = document.querySelector('[data-onboard-height="inches"]').value;
      onboardingDraft.height = heightFromParts(feet, inches, onboardingDraft.height);
    });
  });

  document.querySelectorAll("[data-class-cycle]").forEach(button => {
    button.addEventListener("click", () => {
      cycleClass(Number(button.dataset.classCycle));
    });
  });
}

function renderOnboarding() {
  const shell = document.getElementById("onboarding");
  const splash = document.getElementById("launchSplash");
  if (!shell) return;

  const needsOnboarding = localStorage.getItem(userScopedKey(onboardingKey)) !== "true" || forceOnboarding;
  if (!needsOnboarding) {
    shell.classList.remove("active");
    splash?.classList.remove("active");
    return;
  }

  if (!launchSplashDismissed) {
    splash?.classList.add("active");
    shell.classList.remove("active");
    return;
  }

  splash?.classList.remove("active");
  shell.classList.add("active");

  const screen = onboardingScreens[onboardingStep];
  document.getElementById("onboardingProgress").innerHTML = onboardingScreens.map((_, index) => (
    `<span class="${index <= onboardingStep ? "active" : ""}"></span>`
  )).join("");
  document.getElementById("onboardingContent").innerHTML = `
    <section class="onboarding-screen">
      <p class="eyebrow">${screen.eyebrow}</p>
      <h2>${screen.title}</h2>
      <p>${screen.body}</p>
      ${screen.render()}
    </section>
  `;
  document.getElementById("onboardingBack").style.visibility = onboardingStep === 0 ? "hidden" : "visible";
  document.getElementById("onboardingNext").textContent = onboardingStep === onboardingScreens.length - 1 ? "Start quest" : "Continue";
  bindOnboardingControls();
}

function completeOnboarding() {
  const name = (onboardingDraft.name || "").trim() || "Adventurer";
  Object.assign(profile, onboardingDraft);
  profile.name = name;
  users = users.map(user => user.id === activeUserId ? { ...user, name } : user);
  activeUser = users.find(user => user.id === activeUserId) || activeUser;
  saveJson(usersKey, users);
  saveUserJson(profileKey, profile);
  localStorage.setItem(userScopedKey(onboardingKey), "true");
  document.getElementById("launchSplash")?.classList.remove("active");
  document.getElementById("onboarding").classList.remove("active");
  render();
}

function openDialog(dialog) {
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function closeDialog(dialog) {
  if (typeof dialog.close === "function") {
    dialog.close();
  } else {
    dialog.removeAttribute("open");
  }
}

function openRolloverDialog(session) {
  const dialog = document.getElementById("rolloverDialog");
  if (!dialog || dialog.open) return;

  const completed = new Set(questState.completedExercises[session.date] || []);
  const total = session.generatedExerciseIds?.length || 0;
  const completeCount = session.generatedExerciseIds?.filter(exerciseId => completed.has(exerciseId)).length || 0;
  const missedExercises = (session.generatedExerciseIds || [])
    .filter(exerciseId => !completed.has(exerciseId))
    .map(workoutById)
    .filter(Boolean)
    .map(exercise => exercise.name);

  dialog.dataset.sessionDate = session.date;
  document.getElementById("rolloverSummary").innerHTML = `
    <p><strong>${dateLabel(session.date)} was not fully resolved.</strong></p>
    <p>You completed ${completeCount} of ${total} activities. Confirm whether the remaining work was finished off-app or should stay incomplete.</p>
    ${missedExercises.length ? `<ul>${missedExercises.map(name => `<li>${name}</li>`).join("")}</ul>` : ""}
  `;
  openDialog(dialog);
}

function resolveRolloverSession(completedOffApp) {
  const dialog = document.getElementById("rolloverDialog");
  const dateKey = dialog?.dataset.sessionDate;
  const session = questState.dailySessions?.[dateKey];
  if (!session) return;

  if (completedOffApp) {
    questState.completedExercises[dateKey] = [...new Set([
      ...(questState.completedExercises[dateKey] || []),
      ...(session.generatedExerciseIds || [])
    ])];
    session.status = "complete";
    session.completedAt ||= new Date().toISOString();
    questState.xp += 180;
    questState.streak += 1;
  } else {
    session.status = "incomplete";
    questState.streak = 0;
  }

  session.rolloverResolvedAt = new Date().toISOString();
  saveUserJson(stateKey, questState);
  closeDialog(dialog);
  render();
}

function openMenuDialog() {
  openDialog(document.getElementById("menuDialog"));
}

function renderRelicsDialog() {
  const relics = normalizeList(profile.relics, ["apple-health", "withings-watch", "withings-scale"]);
  document.getElementById("relicSettings").innerHTML = [
    ["apple-health", "Adventurer's Log", "Apple Health"],
    ["withings-watch", "Vitality Amulet", "Withings watch"],
    ["withings-scale", "Oracle Scale", "Withings scale"]
  ].map(([value, label, text]) => `
    <button type="button" class="relic-choice ${relics.includes(value) ? "selected" : ""}" data-relic-setting="${value}">
      <strong>${label}</strong><span>${text}</span>
    </button>
  `).join("");
}

function openRelicsDialog() {
  renderRelicsDialog();
  openDialog(document.getElementById("relicsDialog"));
}

function userInitials(name) {
  return (name || "Adventurer")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join("") || "A";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderUserDialog() {
  const list = document.getElementById("userList");
  if (!list) return;

  list.innerHTML = users.map(user => `
    <button type="button" class="user-card ${user.id === activeUserId ? "selected" : ""}" data-user-id="${user.id}">
      <span class="user-token">${userInitials(user.name)}</span>
      <span>
        <strong>${escapeHtml(user.name)}</strong>
        <small>${user.id === activeUserId ? "Current user" : "Switch to this quest"}</small>
      </span>
    </button>
  `).join("");
}

function openUserDialog() {
  renderUserDialog();
  openDialog(document.getElementById("userDialog"));
}

function reloadWithoutSetup() {
  const url = new URL(window.location.href);
  url.searchParams.delete("setup");
  window.location.href = url.toString();
}

function switchUser(userId) {
  if (!users.some(user => user.id === userId)) return;
  localStorage.setItem(activeUserKey, userId);
  reloadWithoutSetup();
}

function createUser(name) {
  const trimmedName = name.trim() || "New Adventurer";
  const user = {
    id: createUserId(),
    name: trimmedName,
    createdAt: new Date().toISOString()
  };
  users = [...users, user];
  saveJson(usersKey, users);
  localStorage.setItem(activeUserKey, user.id);
  saveJson(userScopedKey(profileKey, user.id), { ...defaultProfile, name: trimmedName });
  saveJson(userScopedKey(stateKey, user.id), { xp: 0, streak: 0, completedToday: false, completedExercises: {}, dailySessions: {} });
  reloadWithoutSetup();
}

function rerunCharacterCreation() {
  onboardingDraft = { ...onboardingDraft, ...profile, relics: profile.relics || onboardingDraft.relics };
  onboardingStep = 0;
  launchSplashDismissed = true;
  localStorage.removeItem(userScopedKey(onboardingKey));
  document.getElementById("onboarding").classList.add("active");
  renderOnboarding();
}

function navigateToPage(pageId) {
  document.querySelectorAll(".app-page, .page-link").forEach(element => element.classList.remove("active"));
  document.getElementById(pageId)?.classList.add("active");
  document.querySelector(`[data-page="${pageId}"]`)?.classList.add("active");
  // Keep the bottom tab bar in sync no matter how navigation was triggered
  // (e.g. tapping the Today's Quest panel routes here without a tab tap).
  document.querySelectorAll(".tabbar-item").forEach(el => el.classList.remove("active"));
  document.querySelector(`.tabbar-item[data-nav="${pageId}"]`)?.classList.add("active");
  if (pageId === "workoutPage") {
    document.querySelector('[data-tab="today"]')?.click();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", () => navigateToPage(button.dataset.page));
});

document.querySelectorAll(".tabbar-item[data-nav]").forEach(item => {
  item.addEventListener("click", () => {
    navigateToPage(item.dataset.nav);
    document.querySelectorAll(".tabbar-item").forEach(el => el.classList.remove("active"));
    item.classList.add("active");
    if (item.dataset.subtab) {
      document.querySelector(`[data-tab="${item.dataset.subtab}"]`)?.click();
    }
  });
});

document.querySelectorAll(".tab").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab, .panel").forEach(el => el.classList.remove("active"));
    button.classList.add("active");
    document.getElementById(button.dataset.tab).classList.add("active");
  });
});

document.getElementById("exerciseList").addEventListener("click", event => {
  const performanceButton = event.target.closest("[data-log-exercise]");
  if (performanceButton) {
    saveExercisePerformance(performanceButton.dataset.logExercise);
    return;
  }

  const doneButton = event.target.closest("[data-done-exercise]");
  if (doneButton) {
    saveExerciseFeedback(doneButton.dataset.doneExercise, doneButton.dataset.sessionDate || todayKey());
    return;
  }

  if (event.target.closest("button, input, select, textarea, label")) return;

  const card = event.target.closest("[data-exercise-card]");
  if (!card) return;
  activeExerciseId = activeExerciseId === card.dataset.exerciseCard ? null : card.dataset.exerciseCard;
  render();
});

document.getElementById("exerciseList").addEventListener("keydown", event => {
  if (!["Enter", " "].includes(event.key)) return;
  if (event.target.closest("button, input, select, textarea, label")) return;
  const card = event.target.closest("[data-exercise-card]");
  if (!card) return;
  event.preventDefault();
  activeExerciseId = activeExerciseId === card.dataset.exerciseCard ? null : card.dataset.exerciseCard;
  render();
});

document.getElementById("exerciseLibrary").addEventListener("click", event => {
  const performanceButton = event.target.closest("[data-log-exercise]");
  if (performanceButton) {
    saveExercisePerformance(performanceButton.dataset.logExercise);
    return;
  }

  const doneButton = event.target.closest("[data-done-exercise]");
  if (doneButton) {
    saveExerciseFeedback(doneButton.dataset.doneExercise, doneButton.dataset.sessionDate || todayKey());
    return;
  }

  if (event.target.closest("button, input, select, textarea, label")) return;

  const card = event.target.closest("[data-library-exercise]");
  if (!card) return;
  activeLibraryExerciseId = activeLibraryExerciseId === card.dataset.libraryExercise ? null : card.dataset.libraryExercise;
  renderExerciseLibrary();
});

document.getElementById("exerciseLibrary").addEventListener("keydown", event => {
  if (!["Enter", " "].includes(event.key)) return;
  if (event.target.closest("button, input, select, textarea, label")) return;
  const card = event.target.closest("[data-library-exercise]");
  if (!card) return;
  event.preventDefault();
  activeLibraryExerciseId = activeLibraryExerciseId === card.dataset.libraryExercise ? null : card.dataset.libraryExercise;
  renderExerciseLibrary();
});

document.getElementById("heroStatusOptions").addEventListener("click", event => {
  const button = event.target.closest("[data-hero-status]");
  if (!button) return;
  profile.readiness = button.dataset.heroStatus;
  activeExerciseId = null;
  saveUserJson(profileKey, profile);
  render();
});

document.getElementById("menuDialog").addEventListener("click", event => {
  const closeButton = event.target.closest(".icon-close");
  if (closeButton) {
    closeDialog(document.getElementById("menuDialog"));
    return;
  }

  const actionButton = event.target.closest("[data-menu-action]");
  if (!actionButton) return;
  closeDialog(document.getElementById("menuDialog"));

  if (actionButton.dataset.menuAction === "user-info") openProfileDialog();
  if (actionButton.dataset.menuAction === "users") openUserDialog();
  if (actionButton.dataset.menuAction === "character-creation") rerunCharacterCreation();
  if (actionButton.dataset.menuAction === "relics") openRelicsDialog();
  if (actionButton.dataset.menuAction === "exercises") {
    renderExerciseLibrary();
    openDialog(document.getElementById("libraryDialog"));
  }
});

document.getElementById("libraryDialog").addEventListener("click", event => {
  if (event.target.closest(".icon-close")) closeDialog(document.getElementById("libraryDialog"));
});

document.getElementById("relicsDialog").addEventListener("click", event => {
  if (event.target.closest(".icon-close")) {
    closeDialog(document.getElementById("relicsDialog"));
    return;
  }

  const button = event.target.closest("[data-relic-setting]");
  if (!button) return;
  const relics = new Set(normalizeList(profile.relics, ["apple-health", "withings-watch", "withings-scale"]));
  if (relics.has(button.dataset.relicSetting)) {
    relics.delete(button.dataset.relicSetting);
  } else {
    relics.add(button.dataset.relicSetting);
  }
  profile.relics = [...relics];
  saveUserJson(profileKey, profile);
  renderRelicsDialog();
});

document.getElementById("userDialog").addEventListener("click", event => {
  if (event.target.closest(".icon-close")) {
    closeDialog(document.getElementById("userDialog"));
    return;
  }

  const userButton = event.target.closest("[data-user-id]");
  if (!userButton) return;
  switchUser(userButton.dataset.userId);
});

document.getElementById("newUserForm").addEventListener("submit", event => {
  event.preventDefault();
  createUser(document.getElementById("newUserName").value);
});

document.getElementById("confirmPreviousComplete").addEventListener("click", () => {
  resolveRolloverSession(true);
});

document.getElementById("confirmPreviousIncomplete").addEventListener("click", () => {
  resolveRolloverSession(false);
});

function openProfileDialog() {
  const height = heightParts(profile.height);
  document.getElementById("nameInput").value = activeUser?.name || profile.name || "Adventurer";
  document.getElementById("ageInput").value = profile.age;
  document.getElementById("heightFeetInput").value = height.feet;
  document.getElementById("heightInchesInput").value = height.inches;
  document.getElementById("weightInput").value = profile.weight;
  document.getElementById("goalInput").value = profile.goal;
  openDialog(document.getElementById("profileDialog"));
}

document.getElementById("settingsButton").addEventListener("click", openMenuDialog);

document.getElementById("rerollQuest").addEventListener("click", rerollTodayQuest);

document.getElementById("welcomeSignUp").addEventListener("click", () => {
  launchSplashDismissed = true;
  onboardingStep = 0;
  renderOnboarding();
});

document.getElementById("welcomeLogin").addEventListener("click", () => {
  launchSplashDismissed = true;
  localStorage.setItem(userScopedKey(onboardingKey), "true");
  document.getElementById("launchSplash")?.classList.remove("active");
  document.getElementById("onboarding")?.classList.remove("active");
  render();
});

document.querySelectorAll("[data-open-workout]").forEach(button => {
  button.addEventListener("click", () => navigateToPage("workoutPage"));
});

document.getElementById("onboardingBack").addEventListener("click", () => {
  onboardingStep = Math.max(0, onboardingStep - 1);
  renderOnboarding();
});

document.getElementById("onboardingNext").addEventListener("click", () => {
  if (onboardingStep === onboardingScreens.length - 1) {
    completeOnboarding();
    return;
  }
  onboardingStep += 1;
  renderOnboarding();
});

document.getElementById("saveProfile").addEventListener("click", () => {
  const name = document.getElementById("nameInput").value.trim() || "Adventurer";
  profile.name = name;
  profile.age = Number(document.getElementById("ageInput").value) || profile.age;
  profile.height = heightFromParts(
    document.getElementById("heightFeetInput").value,
    document.getElementById("heightInchesInput").value,
    profile.height
  );
  profile.weight = Number(document.getElementById("weightInput").value) || profile.weight;
  profile.goal = document.getElementById("goalInput").value;
  users = users.map(user => user.id === activeUserId ? { ...user, name } : user);
  activeUser = users.find(user => user.id === activeUserId) || activeUser;
  saveJson(usersKey, users);
  saveUserJson(profileKey, profile);
  render();
});

document.getElementById("rerunSetup").addEventListener("click", () => {
  document.getElementById("profileDialog").close();
  rerunCharacterCreation();
});

document.getElementById("completeWorkout").addEventListener("click", () => {
  const dateKey = todayKey();
  const session = ensureTodaySession();
  if (!isSessionComplete(dateKey)) {
    questState.completedExercises[dateKey] = [...new Set([
      ...(questState.completedExercises[dateKey] || []),
      ...(session.generatedExerciseIds || [])
    ])];
    session.status = "complete";
    session.completedAt ||= new Date().toISOString();
    questState.completedToday = true;
    questState.xp += 180;
    questState.streak += 1;
    saveUserJson(stateKey, questState);
    document.getElementById("completeWorkout").textContent = "Quest complete";
    render();
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

loadWorkouts()
  .catch(error => {
    workoutLibrary = [];
    classMixes = {};
    classPreferences = {};
    workoutLoadError = error?.message || "Refresh the app and check that data/workouts.tsv is available.";
  })
  .finally(() => {
    render();
    renderOnboarding();
  });
