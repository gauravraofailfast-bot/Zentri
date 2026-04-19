extends BaseTemplate

var _prompt_label: Label
var _pad: MeasurementPad
var _choice_flow: FlowContainer
var _confirm_button: Button
var _scenarios: Array = []
var _scenario_index := 0
var _correct := 0
var _selected_choice := ""


func setup_level(data: Dictionary) -> void:
	super.setup_level(data)
	clear_interaction()
	_scenarios = data.get("template_payload", {}).get("scenarios", [])
	_scenario_index = 0
	_correct = 0
	_build_ui()
	_load_scenario()


func _build_ui() -> void:
	var root := get_interaction_root()
	_prompt_label = Label.new()
	_prompt_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	root.add_child(_prompt_label)

	_pad = MeasurementPad.new()
	root.add_child(_pad)

	_choice_flow = FlowContainer.new()
	_choice_flow.add_theme_constant_override("h_separation", 12)
	_choice_flow.add_theme_constant_override("v_separation", 12)
	root.add_child(_choice_flow)

	_confirm_button = Button.new()
	_confirm_button.text = "Confirm mission step"
	_confirm_button.pressed.connect(_confirm_step)
	root.add_child(_confirm_button)


func _load_scenario() -> void:
	for child in _choice_flow.get_children():
		child.queue_free()

	_selected_choice = ""
	var scenario := _scenarios[_scenario_index]
	_prompt_label.text = "%s\n%s" % [scenario.get("title", ""), scenario.get("question", "")]
	_pad.set_target(float(scenario.get("target_angle", 45.0)), 5.0)

	var options := _build_options_for_scenario(scenario)
	for option in options:
		var button := Button.new()
		button.text = option
		button.custom_minimum_size = Vector2(220, 56)
		button.pressed.connect(_pick_choice.bind(option))
		_choice_flow.add_child(button)


func _build_options_for_scenario(scenario: Dictionary) -> Array:
	var question := String(scenario.get("question", "")).to_lower()
	if question.contains("elevation or depression"):
		return ["elevation", "depression"]
	return ["sin", "cos", "tan"]


func _pick_choice(choice: String) -> void:
	_selected_choice = choice
	register_success("Choice locked: %s" % choice)


func _confirm_step() -> void:
	if _selected_choice.is_empty():
		register_mistake("Pick the angle type or ratio tool before confirming the mission step.")
		return

	var scenario := _scenarios[_scenario_index]
	var expected_choice := _infer_expected_choice(scenario)
	if _pad.is_target_hit() and _selected_choice == expected_choice:
		_correct += 1
		register_success("Mission step cleared. The line of sight and reasoning both match.")
		_scenario_index += 1
		if _scenario_index >= _scenarios.size():
			finish_level(float(_correct) / max(1.0, float(_scenarios.size())), {
				"encouragement": "You completed the mission path with applied trigonometry, not just recognition."
			})
			return
		_load_scenario()
	else:
		register_mistake("The mission is not stable yet. Recheck the angle and the chosen tool.")


func _infer_expected_choice(scenario: Dictionary) -> String:
	var question := String(scenario.get("question", "")).to_lower()
	if question.contains("elevation or depression"):
		return String(scenario.get("answer", ""))
	var hint_equation := String(scenario.get("hint_equation", "")).to_lower()
	if hint_equation.begins_with("sin"):
		return "sin"
	if hint_equation.begins_with("cos"):
		return "cos"
	return "tan"
