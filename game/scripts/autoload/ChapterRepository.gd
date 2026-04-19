extends Node

const PACK_PATH := "res://data/phase1_chapter_pack.json"
const COVERAGE_PATH := "res://data/coverage_matrix.json"

const TEMPLATE_SCENES := {
	"tool_lab": "res://scenes/templates/ToolLabTemplate.tscn",
	"triangle_builder": "res://scenes/templates/TriangleBuilderTemplate.tscn",
	"ratio_forge": "res://scenes/templates/RatioForgeTemplate.tscn",
	"angle_memory_arena": "res://scenes/templates/AngleMemoryArenaTemplate.tscn",
	"identity_reactor": "res://scenes/templates/IdentityReactorTemplate.tscn",
	"field_mission": "res://scenes/templates/FieldMissionTemplate.tscn"
}

var pack: Dictionary = {}
var coverage: Dictionary = {}
var _world_by_id: Dictionary = {}
var _level_by_id: Dictionary = {}
var _competency_by_id: Dictionary = {}


func _ready() -> void:
	load_content()


func load_content() -> void:
	pack = _read_json(PACK_PATH)
	coverage = _read_json(COVERAGE_PATH)
	_world_by_id.clear()
	_level_by_id.clear()
	_competency_by_id.clear()

	for world in pack.get("worlds", []):
		_world_by_id[world.id] = world

	for level in pack.get("levels", []):
		_level_by_id[level.id] = level

	for competency in pack.get("competencies", []):
		_competency_by_id[competency.id] = competency


func _read_json(resource_path: String) -> Dictionary:
	var file := FileAccess.open(resource_path, FileAccess.READ)
	if file == null:
		push_error("Could not read JSON at %s" % resource_path)
		return {}
	var parsed := JSON.parse_string(file.get_as_text())
	if typeof(parsed) != TYPE_DICTIONARY:
		push_error("Expected dictionary JSON at %s" % resource_path)
		return {}
	return parsed


func get_pack() -> Dictionary:
	return pack


func get_coverage() -> Dictionary:
	return coverage


func get_worlds() -> Array:
	return pack.get("worlds", [])


func get_world(world_id: String) -> Dictionary:
	return _world_by_id.get(world_id, {})


func get_level(level_id: String) -> Dictionary:
	return _level_by_id.get(level_id, {})


func get_levels_for_world(world_id: String) -> Array:
	var world := get_world(world_id)
	var result: Array = []
	for level_id in world.get("level_ids", []):
		var level := get_level(level_id)
		if not level.is_empty():
			result.append(level)
	return result


func get_all_levels() -> Array:
	return pack.get("levels", [])


func get_level_index(level_id: String) -> int:
	var levels: Array = get_all_levels()
	for index in levels.size():
		if levels[index].id == level_id:
			return index
	return -1


func get_next_level_id(level_id: String) -> String:
	var world := get_world(get_level(level_id).get("world_id", ""))
	var world_levels: Array = world.get("level_ids", [])
	var local_index := world_levels.find(level_id)
	if local_index != -1 and local_index < world_levels.size() - 1:
		return world_levels[local_index + 1]

	var world_ids: Array = []
	for item in get_worlds():
		world_ids.append(item.id)
	var world_index := world_ids.find(world.get("id", ""))
	if world_index != -1 and world_index < world_ids.size() - 1:
		var next_world := get_world(world_ids[world_index + 1])
		var next_levels: Array = next_world.get("level_ids", [])
		if not next_levels.is_empty():
			return next_levels[0]
	return ""


func get_template_scene(template_id: String) -> PackedScene:
	var scene_path := TEMPLATE_SCENES.get(template_id, "")
	if scene_path.is_empty():
		return null
	return load(scene_path)


func get_competency(competency_id: String) -> Dictionary:
	return _competency_by_id.get(competency_id, {})


func get_revision_prompt(prompt_id: String) -> Dictionary:
	for prompt in pack.get("revision_pool", []):
		if prompt.id == prompt_id:
			return prompt
	return {}
