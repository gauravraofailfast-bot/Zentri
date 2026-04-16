# Zentri — Claude Instructions

## What is Zentri?
Game-based learning platform that converts CBSE academic concepts into interactive games.
Fully independent from SprintUp with its own Firebase project (failfast-58c9f).

## Stack
- **Frontend:** Next.js 14, Tailwind CSS, Framer Motion
- **Backend:** Firebase Cloud Functions (Node.js 24)
- **AI:** Gemini Flash API via @google/generative-ai (direct, no Vertex AI)
- **Database:** Firestore (own project: failfast-58c9f, separate from SprintUp)
- **Auth:** Firebase Auth (Email/Password, Phone, Google) — SMS quota: 10/day free

## Key Architecture Decisions
- Zentri has its own Firebase project (failfast-58c9f), fully independent from SprintUp (sprintup-eecbe)
- Curriculum data (exams/subjects/chapters/topics/questions) will be copied from SprintUp once
- Emulator ports differ from SprintUp (Auth: 9199, Functions: 5002, Firestore: 8081)
- Collections: exams, subjects, chapters, topics, questions, games, gameSessions, gameProgress

## Design System
- Follow ALL rules in `DESIGN_GUIDELINES.md` for every UI component built.
- Home page must have ONE primary CTA ("Try it Free" or similar) to nudge the user — no sign-in block on the home page.
- Show sign-in options only AFTER the user clicks the CTA (modal or new screen).


## Quality Gate (Mandatory)
No task is complete until `npm run verify` passes.

## Interactive Testing (Mandatory)
Every user-facing interaction must be tested by actually performing the action in the browser preview — not just verifying the element renders. Specifically:
1. **Click every button and link** — verify the resulting screen/state, not just that the button exists.
2. **Complete full user flows** — e.g., start a level, play through it, see the completion screen, click "Play Again", verify the level restarts.
3. **Test state transitions** — retry, replay, navigation back, refresh. If a button changes URL params or app state, verify the downstream effect.
4. Rendering ≠ working. A button that shows up but does nothing when clicked is a bug.

## Diagram / Figure Accuracy (Mandatory)
Every diagram, drawing, or SVG figure rendered in a game level must be visually verified via screenshot before marking development complete. Specifically:
1. **Figures must match the question** — if the question says "angle of depression" the figure must show the observer looking DOWN, not up. If "standing on a tower", the person must be drawn at the top of the tower.
2. **Labels must be consistent** — angle values, heights, distances, and object names in the figure must match the text of the question and the scenario data.
3. **Verify every scenario** — if a level has multiple scenarios (e.g., 3 different word problems), take a screenshot of EACH scenario's figure, not just the first one. Different scenarios may need completely different layouts.
4. **No generic placeholders** — angle labels must show actual degree values (e.g., "60°", "30°"), not generic text like "angle".

## Hint-Only Compute Phases (Mandatory)
Never show full equations or solution steps to the student before they answer. In compute/solve phases:
1. Show only the question (e.g., "distance = ?") and answer options.
2. Provide a collapsible "Need a hint?" button that reveals only the equation setup (e.g., `tan 60° = 30 / distance`) — never the algebraic steps or final answer.
3. Use `showHint` state, reset it on scenario/step transitions.
4. This applies to ALL game chapters and subjects, not just TrigTrek.

## Planning-Execution Alignment
Every level defined in `gameData.ts` must have a corresponding working component. Do not add levels to the data file with `implemented: false` — either build the level or don't list it. When adding a new game chapter:
1. Decide how many levels the chapter needs based on the NCERT curriculum.
2. Build ALL of them before committing — no partial delivery.
3. Test full progression within each world, then cross-world progression.
4. Only then commit and mark as done.

## UI Design Inspiration
- Duolingo (gamification, streaks, XP)
- CRED (premium dark UI, micro-interactions)
- Khan Academy Kids (child-friendly, encouraging)
- Notion (clean structure, minimal chrome)

## Theme
Dark-first. Accent: purple (#6c5ce7). See globals.css for full palette.
