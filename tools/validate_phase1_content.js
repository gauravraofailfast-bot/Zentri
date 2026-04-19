#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const packPath = path.join(repoRoot, "game", "data", "phase1_chapter_pack.json");
const coveragePath = path.join(repoRoot, "game", "data", "coverage_matrix.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function main() {
  const pack = readJson(packPath);
  const coverage = readJson(coveragePath);

  const allowedTemplates = new Set([
    "tool_lab",
    "triangle_builder",
    "ratio_forge",
    "angle_memory_arena",
    "identity_reactor",
    "field_mission",
  ]);

  assert(pack.delivery_target === "android", "Phase 1 must target Android.");
  assert(pack.offline_first === true, "Phase 1 must be offline-first.");
  assert(Array.isArray(pack.source_pdfs) && pack.source_pdfs.length === 2, "Expected exactly two canonical source PDFs.");

  for (const source of pack.source_pdfs) {
    assert(source.file.startsWith("res://"), `Source PDF must use a res:// path: ${source.file}`);
    const relativeFile = source.file.replace("res://", "");
    const filePath = path.join(repoRoot, "game", relativeFile);
    assert(fs.existsSync(filePath), `Missing canonical source PDF: ${filePath}`);
  }

  assert(Array.isArray(pack.worlds) && pack.worlds.length === 4, "Expected four worlds.");
  assert(Array.isArray(pack.levels) && pack.levels.length === 22, "Expected twenty-two levels.");

  const expectedCounts = {
    triangle_lab: 6,
    sacred_angles: 5,
    identity_forge: 5,
    height_seeker: 6,
  };

  const competencies = new Map(pack.competencies.map((entry) => [entry.id, entry]));
  const levelIds = new Set();
  const competencyUsage = new Map();

  for (const level of pack.levels) {
    assert(!levelIds.has(level.id), `Duplicate level id: ${level.id}`);
    levelIds.add(level.id);

    assert(allowedTemplates.has(level.template_id), `Level ${level.id} uses unsupported template ${level.template_id}`);
    assert(level.learning_loop, `Level ${level.id} is missing learning_loop.`);

    for (const key of ["build", "recall", "apply", "revise", "master"]) {
      assert(typeof level.learning_loop[key] === "string" && level.learning_loop[key].length > 0, `Level ${level.id} is missing learning_loop.${key}`);
    }

    assert(Array.isArray(level.competency_tags) && level.competency_tags.length > 0, `Level ${level.id} must have competency tags.`);
    for (const competencyId of level.competency_tags) {
      assert(competencies.has(competencyId), `Level ${level.id} references unknown competency ${competencyId}`);
      competencyUsage.set(competencyId, (competencyUsage.get(competencyId) || 0) + 1);
    }

    assert(Array.isArray(level.hint_setup) && level.hint_setup.length > 0, `Level ${level.id} must have setup-only hints.`);
    for (const hint of level.hint_setup) {
      assert(!/answer is|final answer|therefore/i.test(hint), `Hint for ${level.id} looks like a full solution reveal: ${hint}`);
    }
  }

  for (const world of pack.worlds) {
    const worldLevels = pack.levels.filter((level) => level.world_id === world.id);
    assert(worldLevels.length === expectedCounts[world.id], `World ${world.id} should have ${expectedCounts[world.id]} levels.`);
    assert(Array.isArray(world.level_ids), `World ${world.id} must define level_ids.`);
    assert(world.level_ids.length === expectedCounts[world.id], `World ${world.id} has the wrong level count in level_ids.`);
    for (const levelId of world.level_ids) {
      assert(levelIds.has(levelId), `World ${world.id} references missing level ${levelId}`);
    }
    assert(levelIds.has(world.mastery_gate.gate_level_id), `World ${world.id} references missing mastery gate level ${world.mastery_gate.gate_level_id}`);
  }

  for (const competencyId of competencies.keys()) {
    assert(competencyUsage.has(competencyId), `Competency ${competencyId} is defined but never used.`);
  }

  assert(Array.isArray(coverage.chapter_sections) && coverage.chapter_sections.length >= 5, "Coverage matrix must include chapter sections.");
  for (const entry of coverage.chapter_sections) {
    for (const levelId of entry.coverage) {
      assert(levelIds.has(levelId), `Coverage section ${entry.id} references missing level ${levelId}`);
    }
  }

  assert(Array.isArray(coverage.exercise_patterns) && coverage.exercise_patterns.length >= 8, "Coverage matrix must include exercise patterns.");
  for (const pattern of coverage.exercise_patterns) {
    assert(Array.isArray(pattern.covers) && pattern.covers.length > 0, `Exercise pattern ${pattern.id} must map to at least one level.`);
    for (const levelId of pattern.covers) {
      assert(levelIds.has(levelId), `Exercise pattern ${pattern.id} references missing level ${levelId}`);
    }
  }

  const gateLevels = new Set((coverage.world_gates || []).map((entry) => entry.gate_level_id));
  for (const world of pack.worlds) {
    assert(gateLevels.has(world.mastery_gate.gate_level_id), `Coverage matrix is missing mastery gate ${world.mastery_gate.gate_level_id}`);
  }

  console.log("Phase 1 content validation passed.");
  console.log(`Worlds: ${pack.worlds.length}`);
  console.log(`Levels: ${pack.levels.length}`);
  console.log(`Competencies: ${pack.competencies.length}`);
}

main();
