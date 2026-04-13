# Zentri — Claude Instructions

## What is Zentri?
Game-based learning platform that converts CBSE academic concepts into interactive games.
Shares Firestore (project: sprintup-eecbe) with SprintUp but has its own frontend and Cloud Functions.

## Stack
- **Frontend:** Next.js 14, Tailwind CSS, Framer Motion
- **Backend:** Firebase Cloud Functions (Node.js 24)
- **AI:** Gemini Flash API via @google/generative-ai (direct, no Vertex AI)
- **Database:** Firestore (shared with SprintUp — same project)
- **Auth:** Firebase Auth (shared with SprintUp)

## Key Architecture Decisions
- Emulator ports differ from SprintUp (Auth: 9199, Functions: 5002, Firestore: 8081)
- Functions use codebase name "zentri" to avoid collision with SprintUp's "default"
- Reads existing SprintUp collections (exams, subjects, chapters, topics, questions)
- Writes to new collections: games, gameSessions, gameProgress

## Quality Gate (Mandatory)
No task is complete until `npm run verify` passes.

## Data-Driven Task Completion (Mandatory)
When building features derived from structured data (e.g., NCERT curriculum chapters, level lists, module lists):
1. **Enumerate ALL items first** — create a checklist of every item that must be built (e.g., all 18 levels across all 4 worlds, not just a sample).
2. **Build ALL items** — do not skip items or mark them as "coming soon." If the data says 5 levels exist in a world, build all 5.
3. **Test end-to-end per module** — complete every item within a module (e.g., all levels in World 1) and verify the full progression before moving to the next module.
4. **No partial delivery** — a module is not done until every item in it is implemented and tested. Cross-module progression must also be verified after all modules are complete.
5. **Mark `implemented: true`** in data files only after the component exists and compiles.

## UI Design Inspiration
- Duolingo (gamification, streaks, XP)
- CRED (premium dark UI, micro-interactions)
- Khan Academy Kids (child-friendly, encouraging)
- Notion (clean structure, minimal chrome)

## Theme
Dark-first. Accent: purple (#6c5ce7). See globals.css for full palette.
