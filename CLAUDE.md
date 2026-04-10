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

## UI Design Inspiration
- Duolingo (gamification, streaks, XP)
- CRED (premium dark UI, micro-interactions)
- Khan Academy Kids (child-friendly, encouraging)
- Notion (clean structure, minimal chrome)

## Theme
Dark-first. Accent: purple (#6c5ce7). See globals.css for full palette.
