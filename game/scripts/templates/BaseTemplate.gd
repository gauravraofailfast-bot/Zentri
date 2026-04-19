extends MarginContainer
class_name BaseTemplate

signal completed(result: Dictionary)

var level_data: Dictionary = {}
var mistakes := 0
var hints_used := 0

var _title_label: Label
var _story_label: Label
var _objective_label: Label
var _interaction_root: VBoxContainer
var _hint_button: Button
var _hint_label: Label
var _feedback_label: Label


func setup_level(data: Dictionary) -> void:
	level_data = data
	_ensure_layout()
	_title_label.text = data.get("title", "Level")
	_story_label.text = data.get("story_setup", "")
	_objective_label.text = data.get("objective", "")
	_hint_label.text = ""
	_feedback_label.text = ""
	_feedback_label.modulate = Color.WHITE


func _ensure_layout() -> void:
	if _interaction_root != null:
		return

	add_theme_constant_override("margin_left", 0)
	add_theme_constant_override("margin_right", 0)
	add_theme_constant_override("margin_top", 0)
	add_theme_constant_override("margin_bottom", 0)
	size_flags_vertical = Control.SIZE_EXPAND_FILL

	var card := PanelContainer.new()
	card.size_flags_vertical = Control.SIZE_EXPAND_FILL
	add_child(card)

	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 20)
	margin.add_theme_constant_override("margin_right", 20)
	margin.add_theme_constant_override("margin_top", 20)
	margin.add_theme_constant_override("margin_bottom", 20)
	card.add_child(margin)

	var stack := VBoxContainer.new()
	stack.size_flags_vertical = Control.SIZE_EXPAND_FILL
	stack.add_theme_constant_override("separation", 14)
	margin.add_child(stack)

	_title_label = Label.new()
	_title_label.add_theme_font_size_override("font_size", 28)
	stack.add_child(_title_label)

	_story_label = Label.new()
	_story_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	_story_label.modulate = Color("d9ebff")
	stack.add_child(_story_label)

	_objective_label = Label.new()
	_objective_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	_objective_label.modulate = Color("8fd3ff")
	stack.add_child(_objective_label)

	_interaction_root = VBoxContainer.new()
	_interaction_root.size_flags_vertical = Control.SIZE_EXPAND_FILL
	_interaction_root.add_theme_constant_override("separation", 14)
	stack.add_child(_interaction_root)

	_hint_button = Button.new()
	_hint_button.text = "Need a hint?"
	_hint_button.pressed.connect(_toggle_hint)
	stack.add_child(_hint_button)

	_hint_label = Label.new()
	_hint_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	_hint_label.modulate = Color("ffd27d")
	stack.add_child(_hint_label)

	_feedback_label = Label.new()
	_feedback_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	stack.add_child(_feedback_label)


func clear_interaction() -> void:
	_ensure_layout()
	for child in _interaction_root.get_children():
		child.queue_free()


func get_interaction_root() -> VBoxContainer:
	_ensure_layout()
	return _interaction_root


func register_mistake(message: String) -> void:
	mistakes += 1
	_feedback_label.text = message
	_feedback_label.modulate = Color("ff9688")


func register_success(message: String) -> void:
	_feedback_label.text = message
	_feedback_label.modulate = Color("8fffca")


func finish_level(accuracy: float, extra: Dictionary = {}) -> void:
	var independence := max(0.25, 1.0 - (float(hints_used) * 0.15))
	var score := clamp(accuracy * 0.55 + independence * 0.25 + 0.20, 0.0, 1.0)
	var stars := 1
	if score >= 0.92:
		stars = 3
	elif score >= 0.8:
		stars = 2

	var result := {
		"level_id": level_data.get("id", ""),
		"accuracy": accuracy,
		"independence": independence,
		"completion": 1.0,
		"score": score,
		"stars": stars,
		"mistakes": mistakes,
		"hints_used": hints_used,
		"competency_tags": level_data.get("competency_tags", []),
		"xp_awarded": 45 + int(round(accuracy * 25.0)) + int(independence * 10.0),
		"encouragement": extra.get("encouragement", "Nice work. Keep building mastery through clean retries and steady reasoning.")
	}
	completed.emit(result)


func _toggle_hint() -> void:
	if level_data.is_empty():
		return
	if _hint_label.text.is_empty():
		hints_used += 1
		_hint_label.text = "\n".join(PackedStringArray(level_data.get("hint_setup", [])))
		_hint_button.text = "Hide hint"
	else:
		_hint_label.text = ""
		_hint_button.text = "Need a hint?"
