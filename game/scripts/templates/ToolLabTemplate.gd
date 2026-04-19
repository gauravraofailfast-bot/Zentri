extends BaseTemplate

var _pad: MeasurementPad
var _prompt_label: Label
var _next_button: Button
var _targets: Array = []
var _target_index := 0
var _hits := 0


func setup_level(data: Dictionary) -> void:
	super.setup_level(data)
	clear_interaction()
	_targets = data.get("template_payload", {}).get("targets", [])
	_target_index = 0
	_hits = 0
	_build_ui()
	_load_target()


func _build_ui() -> void:
	var root := get_interaction_root()
	_prompt_label = Label.new()
	_prompt_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	root.add_child(_prompt_label)

	_pad = MeasurementPad.new()
	root.add_child(_pad)

	_next_button = Button.new()
	_next_button.text = "Confirm alignment"
	_next_button.pressed.connect(_confirm_target)
	root.add_child(_next_button)


func _load_target() -> void:
	var target := _targets[_target_index]
	_prompt_label.text = "Use the %s to hit the hidden target for %s." % [target.get("tool", "tool"), target.get("scene", "scene")]
	_pad.set_target(float(target.get("target_angle", 45.0)), float(target.get("tolerance", 5.0)))


func _confirm_target() -> void:
	if _pad.is_target_hit():
		_hits += 1
		register_success("Locked. The current line or angle matches the scene requirement.")
		_target_index += 1
		if _target_index >= _targets.size():
			finish_level(float(_hits) / max(1.0, float(_targets.size())))
			return
		_load_target()
	else:
		register_mistake("Not locked yet. Keep adjusting the angle finder until it aligns.")
