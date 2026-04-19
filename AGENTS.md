# Zentri — Codex Instructions

## What is Zentri?
Zentri is a game-based learning platform that turns CBSE academic concepts into interactive games.
Phase 1 is an Android-first Godot app focused on NCERT Class 10 Mathematics Chapters 8 and 9.

## Current Default Build Target
- **Primary runtime:** Godot 4 mobile game in `game/`
- **Target platform:** Android first, iOS later from the same codebase
- **Gameplay model:** Offline-first with bundled content packs and local save data
- **Website/admin surfaces:** Existing Next.js and Firebase code may remain in the repo, but they are not the default implementation target for Phase 1 gameplay work

## Canonical Syllabus Sources
- Treat these PDFs as the source of truth for Phase 1 syllabus coverage:
  - `game/references/ncert/jemh108.pdf`
  - `game/references/ncert/jemh109.pdf`
- Do not add or remove concepts from the Phase 1 chapter pack unless they can be justified against those PDFs.

## Architecture Rules
- Gameplay must not depend on Firestore, Cloud Functions, or live AI calls at runtime.
- Core chapter content must ship as bundled data inside the Godot app.
- Reusable gameplay templates are mandatory. Do not hand-build one-off level logic when the content can be expressed through shared template scenes and data.
- Every level defined in the Phase 1 chapter pack must be playable. Do not add placeholder levels.
- Phase 2 can move authoring and delivery online, but Phase 1 content structure must already be data-driven enough to migrate cleanly.

## Phase 1 Gameplay Scope
- Phase 1 covers NCERT Class 10 Mathematics:
  - Chapter 8: Introduction to Trigonometry
  - Chapter 9: Some Applications of Trigonometry
- Coverage target is **concept-complete**:
  - every chapter subsection must be represented
  - every major exercise pattern must map to either a level or a mastery assessment
- Chapter 8 is the teaching backbone and Chapter 9 is the applications/capstone layer.

## Quality Gate (Mandatory)
No task is complete until `npm run verify` passes.

## Interactive Testing (Mandatory)
Every user-facing interaction must be tested by actually performing it in the target runtime.
For Phase 1 game work, that means:
1. Test full play loops in the Godot game, not only scene loading.
2. Verify build, recall, apply, revise, and mastery transitions for each template.
3. Test retry and remediation flows, including progression unlocks and local-save persistence.
4. Rendering is not enough. A level is incomplete until the interaction works end to end.

## Diagram / Figure Accuracy (Mandatory)
Every geometry-heavy scene or figure must be visually verified before work is marked complete.
Specifically:
1. The scene must match the NCERT problem statement exactly.
2. Labels, angle values, heights, distances, and observer positions must match the level data.
3. If a level contains multiple scenarios, verify every scenario, not just the first.
4. No generic angle placeholders. Always render actual values from the scenario data.

## Hint-Only Compute Phases (Mandatory)
Never reveal full algebraic steps or final answers before the student responds.
1. Compute phases may show the question and interactive answer surface only.
2. The hint interaction may reveal equation setup or relationship setup only.
3. Hints must reset on scenario changes and retries.
4. This rule applies to every chapter and template, not just application levels.

## Encouragement and Mastery
- No permanent fail states.
- Retries must always be available.
- Mastery gates should reward accuracy, independence, and completion rather than speed alone.
- When a learner struggles repeatedly, the game should route them into a lighter remediation variant tied to the same competency tags.
- XP and stars should encourage progress, not punish experimentation.

## Data and Content Rules
- The bundled chapter pack must define:
  - chapter metadata
  - world structure
  - levels
  - competency tags
  - mastery gates
  - revision pool
- The syllabus coverage matrix must stay in sync with the chapter pack.
- If a competency tag is introduced, it must be used by at least one level or mastery gate.

## Existing Web Surfaces
- If you work on the existing website, still follow `DESIGN_GUIDELINES.md`.
- Home page should keep one primary CTA.
- Do not let website work dictate Phase 1 gameplay architecture.

## Theme and Feel
- The Android game should feel premium, tactile, and encouraging.
- Prefer high-clarity touch interactions, clean typography, and confident motion over flashy clutter.
- Keep the tone student-friendly and mastery-oriented.
