# QuestForge Fitness Feature Backlog

This backlog captures planned product work for QuestForge Fitness. Priorities are intended to guide sequencing, not permanently lock scope.

## Priority Key

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
- Ledger copy pattern is locked: state today's progress as "X% of today's travel goal reached," and explicitly say goal-completion moves the same map distance as any other user reaching their own goal. This is a deliberate, recurring product theme — see the "relative success" principle below — not unique to this screen.

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
