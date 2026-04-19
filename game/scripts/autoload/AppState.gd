extends Node

const SAVE_PATH := "user://phase1_progress.json"

var state: Dictionary = {}


func _ready() -> void:
	load_progress()


func _default_state() -> Dictionary:
	return {
		"xp": 0,
		"stars": 0,
		"completed_levels": {},
		"revision_queue": [],
		"world_unlocks": ["triangle_lab"]
	}


func load_progress() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		state = _default_state()
		save_progress()
		return
	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file == null:
		state = _default_state()
		return
	var parsed := JSON.parse_string(file.get_as_text())
	if typeof(parsed) == TYPE_DICTIONARY:
		state = _default_state()
		for key in parsed.keys():
			state[key] = parsed[key]
	else:
		state = _default_state()


func save_progress() -> void:
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file == null:
		push_error("Could not save progress to %s" % SAVE_PATH)
		return
	file.store_string(JSON.stringify(state, "\t"))


func reset_progress() -> void:
	state = _default_state()
	save_progress()


func get_xp() -> int:
	return int(state.get("xp", 0))


func get_stars() -> int:
	return int(state.get("stars", 0))


func get_completed_levels() -> Dictionary:
	return state.get("completed_levels", {})


func get_revision_queue() -> Array:
	return state.get("revision_queue", [])


func is_world_unlocked(world_id: String) -> bool:
	var unlocks: Array = state.get("world_unlocks", [])
	return unlocks.has(world_id)


func is_level_unlocked(level_id: String) -> bool:
	var level := ChapterRepository.get_level(level_id)
	if level.is_empty():
		return false

	var world_id := level.get("world_id", "")
	if not is_world_unlocked(world_id):
		return false

	var world := ChapterRepository.get_world(world_id)
	var world_levels: Array = world.get("level_ids", [])
	var index := world_levels.find(level_id)
	if index <= 0:
		return true

	var completed: Dictionary = get_completed_levels()
	return completed.has(world_levels[index - 1])


func get_level_result(level_id: String) -> Dictionary:
	return get_completed_levels().get(level_id, {})


func complete_level(result: Dictionary) -> void:
	var level_id := result.get("level_id", "")
	if level_id.is_empty():
		return

	var completed := get_completed_levels()
	completed[level_id] = result
	state["completed_levels"] = completed
	state["xp"] = get_xp() + int(result.get("xp_awarded", 0))
	state["stars"] = get_stars() + int(result.get("stars", 0))

	var queue: Array = get_revision_queue().duplicate()
	for competency_id in result.get("competency_tags", []):
		if result.get("accuracy", 0.0) < 0.75 and not queue.has(competency_id):
			queue.append(competency_id)
		if result.get("accuracy", 0.0) >= 0.75 and queue.has(competency_id):
			queue.erase(competency_id)
	state["revision_queue"] = queue

	_unlock_next_world_if_ready(level_id)
	save_progress()


func _unlock_next_world_if_ready(level_id: String) -> void:
	var level := ChapterRepository.get_level(level_id)
	if level.is_empty():
		return
	var world := ChapterRepository.get_world(level.get("world_id", ""))
	var gate_level_id := world.get("mastery_gate", {}).get("gate_level_id", "")
	if gate_level_id != level_id:
		return

	var world_ids: Array = []
	for item in ChapterRepository.get_worlds():
		world_ids.append(item.id)
	var current_index := world_ids.find(world.get("id", ""))
	if current_index == -1 or current_index >= world_ids.size() - 1:
		return

	var unlocks: Array = state.get("world_unlocks", []).duplicate()
	var next_world_id := world_ids[current_index + 1]
	if not unlocks.has(next_world_id):
		unlocks.append(next_world_id)
	state["world_unlocks"] = unlocks
