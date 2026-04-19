# Zentri Phase 1 Godot App

This directory contains the Android-first Godot 4 implementation for the Phase 1 NCERT Class 10 Mathematics MVP.

## Scope

- Offline-first mobile game
- Bundled chapter pack for NCERT Chapter 8 and Chapter 9
- Four worlds, twenty-two levels
- Six reusable gameplay templates
- Local save and mastery-driven progression

## Canonical syllabus references

- `res://references/ncert/jemh108.pdf`
- `res://references/ncert/jemh109.pdf`

## Project layout

- `data/phase1_chapter_pack.json` - bundled content pack
- `data/coverage_matrix.json` - syllabus-to-level mapping
- `scripts/autoload/` - content and save singletons
- `scripts/screens/` - world map and level shell logic
- `scripts/templates/` - reusable gameplay template logic
- `scripts/widgets/` - touch interaction widgets
- `scenes/` - Godot scenes for the app shell and templates

## Local verification

Run the content validator from the repo root:

```bash
npm run verify:game
```

This checks the chapter pack structure, world counts, template usage, competency coverage, NCERT PDF references, and coverage matrix integrity.

## Android export notes

- Godot 4 Android export is the intended deployment path.
- Core gameplay must work without network access.
- Cloud sync is optional and deferred.
