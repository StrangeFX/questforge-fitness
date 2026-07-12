# QuestForge Workout Generation Requirements

## Product Goal

QuestForge Fitness must generate workouts from a structured exercise library, not by randomly combining movements. Each workout should be goal-specific, safe for the user's current constraints, recoverable, measurable, and easy to progress.

## Required Inputs

The generator should use these inputs before selecting exercises:

- Primary class goal: Barbarian/bodybuilding, Monk/mobility, Ranger/endurance, Paladin/balanced strength, Rogue/conditioning, or Druid/recovery.
- Secondary goal: optional accessory emphasis.
- Experience: beginner, intermediate, or advanced.
- Equipment: none, dumbbells, bands, machines, cardio machines, bench, pull-up bar, mobility tools, pool, bike, outdoor access.
- Time available: target session length.
- Readiness: strong, steady, tired, or sore.
- Limitations: pain, injury, medical restriction, balance limits, joint limits, range limits, pregnancy/postpartum, cardiovascular restrictions, and user-hidden exercises.
- Preferences: liked, disliked, hidden, painful, more variety, less variety, equipment preference, indoor/outdoor preference.
- Recent training history: completed workouts, pain, soreness, difficulty, missed workouts, fatigue, and exercise performance.

## Exercise Data Requirements

Every exercise row must include:

- Stable ID and name.
- Movement category: strength, cardio, yoga, or recovery.
- Visual type for the prototype animation.
- Experience eligibility.
- Required equipment and environment.
- Intensity, impact, fatigue cost, and order rank.
- Movement pattern.
- Primary and secondary muscles.
- Goal suitability tags.
- Exercise tags for scoring and user preference matching.
- Prescription, rest guidance, progression, and regression.
- Rep range, load target, training style, and whether the exercise is eligible for heavy low-rep work.
- Contraindications, redundancy notes, and substitutions.
- Coaching cues.

## Generation Pipeline

1. Resolve the user's class and primary goal.
2. Load the class mix table and preference table.
3. Build desired category slots from the class mix.
4. Filter exercises by equipment, experience, readiness, pain/restrictions, hidden status, and contraindications.
5. Score eligible exercises by class goal, preferred tags, intensity bias, movement coverage, user preference, and fatigue.
6. Select exercises with useful category coverage and limited duplication.
7. Order exercises by safety and training priority.
8. Present measurable prescriptions, cues, and progression/regression guidance.
9. Collect feedback after completion.
10. Adjust future availability and difficulty from feedback.

## Daily Session Lifecycle Rules

Each user must receive a stored daily quest rather than a newly random list on every page render.

Rules:
- Use the user's local calendar date as the daily key.
- Store generated exercise IDs per user and per date.
- Generate the day's exercise list from Hero Status Check, previous comfort/difficulty feedback, player class, available equipment, experience, limitations, hidden exercises, and class mix.
- If Hero Status Check, class, equipment, experience, or limitations change during the same day, regenerate the remaining activities while preserving exercises already marked done.
- When a new local day starts, create a fresh daily quest for that date.
- If an older active quest has unfinished exercises, ask the user whether the missed activities were completed off-app or should remain incomplete.
- Marking the older quest complete should complete its stored exercise IDs and award daily completion progress.
- Leaving the older quest incomplete should preserve partial exercise history and treat the daily quest as missed.
- Exercise feedback from previous sessions should influence future scoring without permanently removing exercises unless the user hides them or the exercise becomes contraindicated.
- Daily rotation must consider more than exact exercise ID. The generator should also rotate movement patterns and primary muscle groups so consecutive strength days do not repeatedly emphasize the same tissues unless the class plan intentionally calls for it.
- If rotation cannot produce meaningful variation because the eligible pool is too small, expand the exercise table rather than relying on random repetition.
- Users may reroll the current daily quest up to two times per local day. Rerolling should preserve completed exercises, replace unfinished exercises, and use a stored seed so the new mixture is stable after refresh.

## Class-Specific Prescription Overrides

Barbarian/bodybuilding can use a heavy growth-focused prescription for suitable dumbbell strength movements.

Rules:
- Heavy Barbarian prescriptions target 4-6 clean reps.
- They apply only to heavy-eligible compound dumbbell movements.
- They apply only for returning or veteran users.
- They apply only when Hero Status is strong or steady.
- They should not apply on tired or sore days.
- They should not apply to yoga, cardio, recovery, light technique, balance, core-control, or isolation/accessory movements by default.
- Heavy work should use longer rest and progression based on clean reps before added load.
- If discomfort, pain flags, poor form, or low readiness are present, the app should fall back to the standard prescription.

## Universal Class and Experience Variation Rules

Every exercise must resolve into a class-aware and experience-aware instruction before it is shown to the user.

Future exercise rule:
- Add one clear base exercise row.
- Include movement type, movement pattern, goals, tags, intensity, fatigue, experience eligibility, progression, regression, and coaching cues.
- The app must then add a class focus and experience target at render time.
- If an exercise needs exact numeric differences by class or experience, create a named override function or an override data table rather than hiding the difference in vague prose.
- If an exercise cannot be made explicit with one row plus class/experience tuning, split it into smaller exercise rows.

Class focus rules:
- Barbarian: strength, hypertrophy, load quality, and recovery that protects lifting.
- Monk: breath, posture, mobility, balance, control, and calm transitions.
- Ranger: walking/running durability, aerobic capacity, legs/feet/hips, and repeatability.
- Paladin: balanced effort across strength, cardio, mobility, and recovery.
- Rogue: efficient conditioning, quick repeatable output, core control, and sharp movement.
- Druid: longevity, restoration, gentle capacity, comfort, and sustainable vitality.

Experience target rules:
- Beginner: easier variation, lower end of range, fewer rounds, longer recovery, smaller range, and more reserve.
- Returning: listed prescription, normal progression, repeatable effort, clean technique.
- Veteran: upper end of range, added round/time/tempo/control, or harder variation only when quality stays high.

## Strength Progression Rules

Strength exercises with a defined rep range should respect the top of that range.

Rules:
- Rep-based strength exercises must be class-tuned at render time.
- Barbarian strength work defaults to 4-6 reps.
- Paladin and Rogue strength work default to 6-8 reps.
- Monk, Ranger, and Druid strength work default to 8-12 reps.
- Low-resource Hero Status moves the prescription one level lighter, with slightly higher reps and lower load.
- Sore Hero Status moves the prescription two levels lighter, with lower load and more conservative regression guidance.
- Rep levels are 4-6, 6-8, 8-12, 10-15, then 12-15 easy reps.
- Weight/load targets should drop with each lighter level: heavy, moderately heavy, moderate, light to moderate, then light.
- If the user has not reached the top of the range, the next target can add reps at the same load.
- If the user reaches the top of the range, the next target should add load and return to the range instead of asking for more reps above the cap.
- Example: for an 8-12 rep goal, logging 12 reps should produce a next target like `+5 lb x 8-12 reps`, not `same weight x 13 reps`.
- Barbarian/bodybuilding should prioritize this capped double-progression behavior.
- Ranger/endurance may allow rep targets above the cap when the movement is explicitly endurance-oriented.

## Cardio Interval Prescription Rules

Cardio interval exercises should be allowed to vary by class and experience, even when they share the same base exercise row.

Fast Walk Intervals rules:
- Beginner users should receive fewer rounds, longer recoveries, or shorter hard intervals.
- Returning users should receive the standard middle prescription.
- Veteran users can receive more rounds, shorter recoveries, or longer hard intervals.
- Ranger should receive the most endurance-specific version, usually more total intervals or longer repeatable efforts.
- Rogue should receive shorter, sharper conditioning intervals.
- Barbarian should receive intervals that support conditioning without compromising strength recovery.
- Monk and Druid should receive smoother, lower-strain prescriptions that emphasize breath, posture, recovery, and control.
- Paladin should receive a balanced prescription that is challenging but recoverable.
- Every interval prescription should include warm-up, hard interval, easy interval, cooldown, progression, and regression guidance.

## Recovery Session Prescription Rules

Recovery exercises must be explicit enough that the user knows exactly what to do without outside knowledge.

Sleep and Mobility Reset rules:
- Keep it as one recovery session unless the user needs a longer standalone sleep routine.
- The sequence should include breathing, gentle mobility, and stillness/downshift.
- Beginner users should receive shorter total time and fewer positions.
- Returning users should receive the standard sequence.
- Veteran users may receive slightly more time, not higher intensity.
- Class changes should affect emphasis, not difficulty: Barbarian downshifts after lifting, Ranger restores walking/running tissues, Monk emphasizes breath and control, Druid emphasizes restoration, Rogue calms restlessness, and Paladin uses balanced recovery.
- The session should never ask the user to force range, chase discomfort, or turn recovery into a workout.

## Availability States

Each exercise can be:

- Available: passes all filters.
- Preferred: passes filters and strongly matches the current class, user preference, or history.
- Conditional: usable only with reduced load, reduced range, warm-up, low pain, or sufficient experience.
- Temporarily unavailable: blocked by soreness, fatigue, equipment loss, recent pain, missed recovery, or poor technique.
- Hidden: user has deliberately removed it until restored.

## Quality Checklist

Before a workout is shown, the generator should confirm:

- It supports the primary class goal.
- Every exercise is currently eligible.
- Required equipment is available.
- Difficulty matches experience.
- Restrictions and pain rules are respected.
- Major movement patterns or energy systems are covered.
- Duplicate movement patterns are intentional.
- Highest-priority work appears early.
- Total duration fits the session.
- Fatigue is recoverable.
- Every exercise is measurable.
- Every exercise has a progression and regression.
- The workout avoids unnecessary complexity.
