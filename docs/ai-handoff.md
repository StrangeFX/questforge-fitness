# QuestForge Fitness AI Handoff

Generated: 2026-07-12

This document is intended to help another AI assistant, developer, or product collaborator understand QuestForge Fitness and continue work from the current prototype without needing the whole prior conversation.

## One-Sentence Product Vision

QuestForge Fitness is an RPG-inspired workout planner and tracker that turns daily strength training, walking/running, yoga, recovery, nutrition habits, and biometric progress into a class-based fantasy campaign.

## User Goal

The primary user wants an app they can use on an iPhone anywhere: at home, work, the store, or outdoors. The desired long-term outcome is a real phone app experience with durable user data, daily workout generation, exercise guidance, gamification, and eventual integration with Apple Health and Withings devices.

The current app is a local-first PWA prototype that is now also hosted through GitHub Pages for anywhere-accessible trials. It is not yet a native iOS app.

## Product Theme

The app uses fantasy RPG and classic DND-style class framing:

- Barbarian: bodybuilding and heavy strength focus.
- Monk: yoga, mobility, balance, breath, and control.
- Ranger: walking, running, and aerobic endurance.
- Paladin: balanced training, consistency, and durability.
- Rogue: conditioning, agility, efficient sessions, and fat-loss leaning work.
- Druid: recovery, longevity, restoration, walking, and vitality.

Every class should still receive a healthy mix of strength, cardio, yoga, and recovery. Classes change proportions, emphasis, rep ranges, and exercise scoring, not the entire exercise universe.

## Current App State

Location:

```text
outputs/fitquest
```

Source and hosted app:

```text
GitHub repository: https://github.com/StrangeFX/questforge-fitness
Git remote: https://github.com/StrangeFX/questforge-fitness.git
Main branch: main
Live GitHub Pages app: https://strangefx.github.io/questforge-fitness/
```

Current form:

- Dependency-free static web app / PWA prototype.
- Hosted on GitHub Pages for live browser/iPhone trials.
- Local-first storage using browser `localStorage`.
- Multiple local users are supported.
- New users see a welcome page using the QuestForge logo; Sign up enters character creation and Log in opens home directly.
- Daily workouts are generated dynamically from structured TSV data.
- Guided exercise cards expand to show instructions, media, progression, regression, feedback inputs, and Done button.
- Strength movements support weight and rep logging.
- Cardio movements support actual minutes completed.
- Home includes direct buttons for Today's workout and Walking Tracker.
- Walking Tracker stores a per-user, per-day goal in minutes and reports progress as a percentage of that goal; optional device steps can be recorded alongside it.
- Exercise media is optional. Missing images show placeholders.
- The app includes fantasy class images, a launch poster, app icon, logo assets, and several exercise demonstration images.

## How To Run

From `outputs/fitquest`:

```powershell
.\dev.ps1
```

The server prints local and LAN URLs. Default local URL:

```text
http://127.0.0.1:4177/index.html
```

If Node.js is installed on PATH, this also works:

```powershell
npm run dev
```

## How To Validate

From `outputs/fitquest`:

```powershell
.\check.ps1
```

The validator checks:

- JavaScript syntax.
- Manifest icon paths.
- Service worker and app asset references.
- Workout table required headers.
- Duplicate workout ids.
- Workout media paths.
- Required class mix and preference rows.

Expected current result:

```text
QuestForge check passed: 120 workouts, 6 classes.
```

## Important Files

- `index.html`: app shell, launch splash, onboarding shell, home screen sections, dialogs, menu.
- `app.js`: most product logic, rendering, local storage, onboarding, workout generation, exercise logging, user switching.
- `styles.css`: visual design system and layout.
- `manifest.json`: PWA metadata and icon.
- `sw.js`: service worker cache.
- `server.mjs`: local development static server.
- `package.json`: developer scripts.
- `dev.ps1`: Windows-friendly server launcher.
- `check.ps1`: Windows-friendly validator launcher.
- `scripts/check.mjs`: project health check.
- `data/workouts.tsv`: master exercise table.
- `data/class-mixes.tsv`: exercise category proportions by class.
- `data/class-preferences.tsv`: class scoring preferences.
- `docs/workout-generation-requirements.md`: workout generation rule set.
- `docs/feature-backlog.md`: product backlog.
- `docs/ai-handoff.md`: this file.
- `assets/`: app art, class art, logos, exercise images.

## Current Data Model

The app stores data in browser `localStorage`, mostly using user-scoped keys:

- `questforge-fitness-users`: local user list.
- `questforge-fitness-active-user`: selected user id.
- `questforge-fitness-profile:<userId>`: biometrics, class, equipment, experience, readiness, relics.
- `questforge-fitness-state:<userId>`: XP, streak, daily sessions, completed exercises, rerolls.
- `questforge-fitness-performance:<userId>`: strength logs by exercise id.
- `questforge-fitness-exercise-feedback:<userId>`: comfort, difficulty, notes, actual minutes, done events.
- `questforge-fitness-onboarding-complete:<userId>`: onboarding completion.

There is no cloud sync yet. If the app is opened in a different browser/device, data will not automatically follow.

## Intended User Experience

### 1. First Launch

The first screen should be the QuestForge Fitness fantasy launch poster. The user taps "Begin Your Quest" to enter setup.

### 2. Character Creation / Onboarding

The user creates their fitness character:

- Enter starting attributes such as age, height in feet/inches, and weight.
- Choose a class: Barbarian, Monk, Ranger, Paladin, Rogue, or Druid.
- Review class imagery and class-specific training proportions.
- Select training experience.
- Select available equipment.
- Select pain flags or constraints.
- Choose campaign level, milestone, nutrition mode, and relic/device preferences.

The setup should feel like creating an RPG character, but the underlying information is ordinary fitness profile data.

### 3. Home Screen

The home screen is "Today's Quest." It shows:

- Active user.
- Current class and class focus.
- Training mix percentages.
- Progress scorecards such as level, streak, XP, goal progress.
- Daily Hero Status Check.
- Today's dynamically generated workout cards.
- Reroll option with daily limit.
- Nutrition estimate.
- Weekly cadence / milestones.

The top-right button is the main menu. The home screen itself should not be described as the menu.

### 4. Main Menu

The top-right menu should contain routes/dialogs such as:

- User Info.
- Users / Switch user.
- Character Creation.
- Relics and Amulets.
- Exercise Library / See all exercises.

### 5. Hero Status Check

The Hero Status Check is a daily readiness input. The user can change it at any time:

- Battle-ready / strong.
- Steady.
- Low resources / tired.
- Sore.

Changing status should materially change remaining activities for the day while preserving completed items. Low-resource and sore answers should shift the remaining plan toward lower intensity, recovery, mobility, and safer substitutions.

### 6. Daily Workout Generation

Each day should generate a new session based on:

- Date.
- Player class.
- Hero Status Check.
- Training experience.
- Available equipment.
- Pain flags.
- Previous comfort feedback.
- Recent exercise history and muscle group rotation.
- Reroll state.

If the previous day ended with unfinished exercises, the app should ask whether they were completed off-app or left incomplete.

### 7. Guided Exercise Cards

Daily activities should start collapsed. A collapsed card shows only:

- Exercise name.
- Short prescription/subtitle.

When clicked, the card expands to show:

- Exercise image or placeholder.
- Class/expertise prescription note when relevant.
- Exercise cues.
- Rest guidance.
- Progression.
- Regression.
- Strength log inputs when applicable.
- Cardio actual minutes input when applicable.
- Comfort slider.
- Difficulty selector.
- Notes field.
- Done button.

### 8. Strength Logging and Progression

Strength exercises should allow the user to log:

- Weight.
- Reps.

The next time the same exercise appears, the app should show previous performance and suggest a goal.

Rep-range rule:

- Barbarian dumbbell strength exercises: 4 to 6 reps.
- Paladin and Rogue dumbbell strength exercises: 6 to 8 reps.
- Monk, Ranger, Druid, and default strength exercises: 8 to 12 reps.
- Low-resource status drops the intensity one level.
- Sore status drops the intensity two levels.
- Weight targets should drop slightly when Hero Status Check is low-resource or sore.

Important progression rule:

If the user hits the top of a rep range, especially for Barbarian/bodybuilding, the next goal should increase weight and reset within the prescribed range. For example, if the goal was 8 to 12 reps and the user logs 12 reps, do not suggest 13 reps. Suggest the next weight tier at 8 to 12 reps.

### 9. Cardio Logging

Walking/running/cardio exercises should allow the user to log:

- Actual minutes completed.

Future steps should include step count, route/map progress, and device integration.

### 10. Exercise Library

The Exercise Library should be available through the top-right menu. It should show all known exercises grouped by type:

- Strength.
- Cardio.
- Yoga.
- Recovery.

Each exercise card should be expandable with the same details used in guided sessions.

### 11. Reroll

The user can reroll today's quest up to two times per day. The reroll action uses the dice image asset.

Reroll should:

- Preserve completed activities.
- Generate a new mix for remaining work.
- Respect class, status, equipment, experience, and safety constraints.

## Current Exercise Media Assets

Current media includes:

- QuestForge launch poster.
- QuestForge app icon.
- QuestForge logos.
- Class images for Barbarian, Monk, Ranger, Paladin, Rogue, Druid.
- Reroll dice image.
- Sun Salutation Flow.
- Hammer Curl.
- Goblet Squat.
- Dumbbell Floor Press.
- Single Leg Reach.
- Dumbbell Split Squat.
- Farmers Carry.
- Box Breathing.
- Brisk Walk.

Exercise media is referenced from `data/workouts.tsv` in the `media_src` column.

## Current Known Limitations

- The app is not yet a native iPhone app.
- The app now has an anywhere-accessible GitHub Pages version, but it is still browser/PWA based.
- Data is local to the browser/device.
- There is no account system or cloud sync.
- Apple Health and Withings are not connected yet.
- Some exercise images are placeholders.
- Most logic is still in one large `app.js`; it should be split into modules.
- No automated UI tests yet.
- Production-like hosting currently uses GitHub Pages; there is not yet a fuller deployment pipeline with environments, previews, or backend data.
- No TestFlight/App Store packaging yet.

## Recommended Next Steps

### Near-Term Practical Path

1. Keep polishing the PWA daily loop.
2. Use the GitHub Pages app for real-world iPhone trials.
3. Improve iPhone Add to Home Screen behavior.
4. Add a durable backend or account sync before relying on it for long-term personal data.
5. Split `app.js` into modules after behavior stabilizes.

### Real iPhone App Path

Once the core product loop is stable:

1. Wrap the web app with Capacitor.
2. Add native iOS project support.
3. Add HealthKit access for Apple Health data.
4. Add notifications if needed.
5. Use TestFlight for real-world trials.
6. Consider App Store only after privacy, HealthKit permissions, data storage, and safety wording are mature.

## Architecture Refactor Plan

The app currently works as one static bundle. The next developer-oriented refactor should preserve behavior while splitting code:

- `src/storage.js`: user-scoped local storage and migrations.
- `src/profile.js`: profile, users, onboarding state.
- `src/workout-data.js`: TSV parsing and workout loading.
- `src/workout-generator.js`: daily session generation, class mix, scoring, substitutions.
- `src/progression.js`: strength progression, rep ranges, weight target logic.
- `src/feedback.js`: comfort, difficulty, completion, actual minutes.
- `src/render.js`: DOM rendering.
- `src/events.js`: event binding.
- `src/app.js`: startup coordinator.

Only refactor in small slices and run `.\check.ps1` after each slice.

## Backlog

The canonical backlog is also stored in `docs/feature-backlog.md`. The backlog below is copied here for AI handoff completeness.

### Priority Key

- P0: Needed for a useful daily fitness loop.
- P1: Important for motivation, retention, or iPhone readiness.
- P2: Valuable expansion once the core loop is dependable.
- P3: Later polish, experiments, or optional depth.

## Product Principle: Relative Success

Every user is fighting their own battles. Metrics, messaging, and rewards throughout the app should measure a person against their own goals and their own improvement over time — never against another user's raw output. Reaching 100% of your own goal should always count the same as anyone else reaching 100% of theirs, whether that's steps, lifting numbers, or session count.

Why this matters: it's what lets a less-fit party member feel their own goals carry just as much validity as anyone else's. The app should reward consistency and improvement, not competition. This already shows up in F-010's goal-normalized map progress and F-050's party-mode fairness rule, but it should extend to achievement copy, streak framing, class campaign milestones, and any future social or leaderboard-style feature — default to goal-relative framing over absolute numbers whenever a feature compares users or displays progress.

## P0 - Core Fitness Loop

### F-001 Guided Exercise Sessions

Status: In progress

Build every queued activity as an expandable guided card with instructions, media, substitutions, comfort feedback, and completion tracking.

Acceptance criteria:

- Collapsed activities show exercise name and prescription only.
- Expanded activities show image or placeholder, cues, progression, regression, feedback inputs, and Done action.
- Strength movements allow weight and rep logging.
- Previous weight and rep performance appears the next time the same movement is queued.

### F-002 Exercise Library Data Expansion

Status: In progress

Continue building the structured exercise table so all classes draw from the same global library while receiving class-flavored scoring and proportions.

Acceptance criteria:

- Exercises are stored in `data/workouts.tsv`.
- Each exercise includes category, equipment, safety flags, progression, regression, instructions, and optional media path.
- No class is restricted to only a small hand-authored list.
- Missing media produces a clear placeholder.

### F-003 Hero Status Check Workout Adjustment

Status: In progress

Make the daily Hero Status Check a real modifier for the remaining workout plan.

Acceptance criteria:

- User can answer or change Hero Status Check at any time during the day.
- Completed activities remain complete.
- Remaining activities regenerate around current readiness.
- Sore or low-resource answers reduce intensity and shift toward mobility, recovery, and gentle cardio.

### F-004 User Profile and Goal Settings

Status: In progress

Create a durable profile area for biometrics, goals, available equipment, training experience, limits, and class selection.

Acceptance criteria:

- Height is entered in feet and inches.
- Weight, age range, goal, training days, equipment, experience, and limits are editable after onboarding.
- Changes affect future workout generation.
- Multiple local users can switch without overwriting each other's profile and progress.

## P1 - Gamification and Retention

### F-010 Adventure Map: Relative Walking Progress

Status: Design locked, implementation not started

Visual design reference: `docs/design/adventure-map.html` (self-contained, open directly in a browser). This is the official layout for this screen — implementation should match it rather than reinterpreting the notes below from scratch.

Locked design decisions from that mockup:
- Vertical campaign route (camp, shrine, bridge, ruins, boss gate, sanctuary) with node medallions alternating left/right, extending the app's existing gilded corner-frame and gold/ink/muted color system rather than introducing a new visual language.
- Three node states: done (steady gold ring), today's target (steady bright gold ring, not pulsing), locked (dimmed, muted text).
- The "you are here" position marker is a separate pulsing dot placed along the route line, distinct from the target node itself. Its position is calculated from the *visible* portion of the line only — the segment between where the stroke clears the previous node's medal edge and where it would enter the next node's medal edge — not the raw node-to-node center distance, which would misrepresent the percentage since both medals visually occlude part of the line.
- At 100% or more of today's goal, the target node itself begins pulsing/glowing and the "you are here" flag re-attaches to point at the node instead of the trail dot. (Not yet built as a second mockup state — only the in-progress state exists in the reference file today.)
- The flag always renders on the side opposite whichever node's text block is nearest, connected to the dot by a short whisker line, so it can never overlap text regardless of which side that text is on.
- Ledger copy pattern is locked: state today's progress as "X% of today's travel goal reached," and explicitly say goal-completion moves the same map distance as any other user reaching their own goal. This is a deliberate, recurring product theme — see the "relative success" principle in the backlog — not unique to this screen.

Create a fantasy map that shows walking progress as campaign travel. Progress across the map must be relative to the user's personal walking goal, not raw physical distance or absolute step count.

Problem:

Different users have different safe and motivating step goals. A user with a 4,000-step daily goal and a user with a 10,000-step daily goal should both be able to complete the same amount of map progress by meeting their own target.

Core rule:

Map progress is calculated from goal completion percentage.

Example:

- User A goal: 4,000 steps. They walk 4,000 steps and earn 100% daily travel progress.
- User B goal: 10,000 steps. They walk 10,000 steps and earn 100% daily travel progress.
- Both users advance the same amount on the adventure map for that day.

Proposed formula:

```text
dailyProgressPercent = min(stepsToday / personalDailyStepGoal, 1.0)
mapTravelEarned = dailyProgressPercent * dailyMapSegmentValue
```

Optional bonus:

Steps above the daily goal can grant XP, gold, streak charge, or cosmetic rewards, but should not be required to keep up with map progression.

Data inputs:

- Steps from Apple Health, Withings watch, or manual entry.
- Personal daily step goal.
- Date and timezone.
- Current map region, node, chapter, and segment.
- Normalized daily progress percent.
- Weekly or campaign progress total.

User experience:

- The map appears as a campaign route with nodes such as camp, shrine, bridge, ruins, boss gate, and sanctuary.
- Daily walking fills the current route segment.
- Reaching 100% of the user's daily step goal moves the same distance regardless of the raw step count.
- Weekly goals can unlock larger milestones such as a new region, class relic, title, or story event.
- Device sync status should be visible but quiet: Apple Health, Withings watch, manual entry, or last synced time.

Fairness and accessibility:

- Progress is based on the user's chosen or recommended goal.
- Goal changes affect future progress, not retroactive map history unless the user explicitly recalculates.
- Rest days may use a smaller travel segment, recovery route, or non-step objective.
- Users with limited mobility can use an equivalent cardio or movement goal if steps are not appropriate.

Acceptance criteria:

- Two users with different step goals earn equal map progress when each reaches 100% of their own goal.
- Partial completion advances proportionally.
- Over-goal performance is rewarded without making the map harder for lower-step users.
- Missing device data can be corrected with manual entry.
- The map explains progress as "today's travel goal" rather than literal miles.
- Progress survives page refresh and can later sync to a user account.

Edge cases:

- No connected device.
- Device sync arrives late.
- Timezone changes during travel.
- User changes step goal mid-day.
- User has a rest day or injury-modified plan.
- User records running, treadmill walking, or indoor steps.

### F-011 Achievements, Titles, and Milestones

Status: Planned

Expand achievements beyond simple streaks into class titles, relics, milestone nodes, consistency badges, recovery achievements, and personal records.

Acceptance criteria:

- Achievements reward consistency, recovery, learning form, and progress, not only high intensity.
- Strength PRs, yoga comfort gains, walking goals, and nutrition consistency can all unlock rewards.
- Rewards are visible from the home screen and Relics and Amulets menu.

### F-012 Class Campaigns

Status: Planned

Give each class a themed campaign path while preserving a balanced mix of strength, cardio, yoga, and recovery.

Acceptance criteria:

- Barbarian emphasizes strength.
- Monk emphasizes yoga, mobility, breath, and control.
- Ranger emphasizes walking, running, and aerobic stamina.
- Paladin emphasizes balanced training and consistency.
- Rogue emphasizes conditioning, agility, and short efficient sessions.
- Druid emphasizes recovery, longevity, restoration, and vitality.

## P1 - Device and iPhone Readiness

### F-020 Apple Health Integration

Status: Planned

Prepare the app for HealthKit data on iPhone, especially steps, walking/running distance, workouts, body mass, resting heart rate, and active energy.

Acceptance criteria:

- The app clearly distinguishes prototype toggles from real permissions.
- Step count can feed the adventure map.
- Body weight can update from Apple Health or Withings scale data.

### F-021 Withings Integration

Status: Planned

Use Withings watch and scale data as optional relics for biometrics and readiness signals.

Acceptance criteria:

- Scale weight can update profile.
- Watch steps can feed map progress.
- Sleep, heart rate, and activity data can inform Hero Status Check suggestions when available.

### F-022 Installable iPhone PWA Polish

Status: Planned

Improve the app's iPhone home-screen behavior.

Acceptance criteria:

- Manifest, icons, service worker, and viewport behavior are ready for Add to Home Screen.
- Offline cache works for core screens and media already loaded.
- Touch targets and dialogs feel natural on iPhone.

### F-023 Real iPhone App Path

Status: Planned

Move from local network testing toward a real phone app experience after the core product loop is stable.

Recommended stages:

- Stage 1: HTTPS-hosted PWA for realistic home-screen testing and easier daily trials.
- Stage 2: Persistent account storage so data follows the user across devices.
- Stage 3: Native iOS wrapper or companion app for Apple Health / HealthKit access.
- Stage 4: TestFlight distribution when HealthKit, notifications, or deeper iOS features become necessary.

Decision note:

Delay native app work until onboarding, workout generation, daily tracking, and user profile persistence are dependable. A hosted PWA is the next practical step before a native iOS build.

## P2 - Nutrition and Recovery

### F-030 Nutrition Recommendations

Status: Planned

Add calorie and macro guidance that matches user goal, body metrics, activity, and class fantasy.

Acceptance criteria:

- Recommendations are clearly informational, not medical care.
- Protein, calories, hydration, and meal timing can adjust based on goal.
- The system can support manual food logging or future integrations.

### F-031 Recovery and Training Load

Status: Planned

Use soreness, sleep, fatigue, prior workouts, and recent performance to avoid overtraining.

Acceptance criteria:

- Consecutive high-fatigue days are limited.
- The app recommends deloads or recovery quests when needed.
- Pain and discomfort feedback affects future exercise selection.

## P2 - Content Operations

### F-040 Exercise Media Pipeline

Status: Planned

Create a repeatable way to add images, GIFs, videos, and cues to exercises.

Acceptance criteria:

- New media can be linked from `workouts.tsv`.
- Missing media is easy to find.
- Looping GIFs or short videos are preferred for movement demonstrations.

### F-041 Exercise Library Editor

Status: Planned

Add an internal editor or import workflow for expanding the exercise table without hand-editing every field.

Acceptance criteria:

- New exercises can be validated before use.
- Required fields are enforced.
- Broken media paths are flagged.

## P3 - Long-Term Expansion

### F-050 Social Party Mode

Status: Future

Allow users to form parties where each person advances through the same campaign using goals scaled to their own ability.

Acceptance criteria:

- Party progress is normalized by each user's personal goals.
- No user has to match another user's raw step count or lifting numbers to contribute.

### F-051 Coach Review Mode

Status: Future

Create a mode for a trainer, physical therapist, or coach to review goals, exercise history, pain flags, and progress.

Acceptance criteria:

- User controls what is shared.
- Review summaries are readable and exportable.

## Safety and Tone Guidance

This is a fitness product, so future AI/developers should avoid medical certainty. Use language like "informational," "adjust," "scale," "stop if sharp pain," and "consult a professional for medical concerns." The app should encourage consistency, recovery, and safe progression rather than punishing missed days or pushing unsafe intensity.

The tone should be immersive and motivating, but the core controls must remain clear, practical, and usable during a real workout.
