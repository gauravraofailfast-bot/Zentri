extends BaseTemplate

var _pad: TrianglePad
var _prompt_label: Label
var _slot_container: FlowContainer
var _token_container: FlowContainer
var _submit_button: Button
var _round_index := 0
var _rounds: Array = []
var _correct_rounds := 0
var _slot_map: Dictionary = {}


func setup_level(data: Dictionary) -> void:
	super.setup_level(data)
	clear_interaction()
	var payload := data.get("template_payload", {})
	_round_index = 0
	_correct_rounds = 0
	_rounds = payload.get("rounds", [])
	_build_ui()
	_configure_pad(payload)
	_load_round()


func _build_ui() -> void:
	var root := get_interaction_root()

	_prompt_label = Label.new()
	_prompt_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	root.add_child(_prompt_label)

	_pad = TrianglePad.new()
	root.add_child(_pad)

	_slot_container = FlowContainer.new()
	_slot_container.add_theme_constant_override("h_separation", 12)
	_slot_container.add_theme_constant_override("v_separation", 12)
	root.add_child(_slot_container)

	_token_container = FlowContainer.new()
	_token_container.add_theme_constant_override("h_separation", 12)
	_token_container.add_theme_constant_override("v_separation", 12)
	root.add_child(_token_container)

	_submit_button = Button.new()
	_submit_button.text = "Check build"
	_submit_button.pressed.connect(_confirm_round)
	root.add_child(_submit_button)


func _configure_pad(payload: Dictionary) -> void:
	_pad.configure(payload.get("mode", "label_sides"), payload.get("vertices", {}), "A", payload.get("goal", {}))


func _load_round() -> void:
	_slot_map.clear()
	for child in _slot_container.get_children():
		child.queue_free()
	for child in _token_container.get_children():
		child.queue_free()

	var payload := level_data.get("template_payload", {})
	var mode := payload.get("mode", "label_sides")
	if mode == "label_sides":
		var round := _rounds[_round_index]
		_pad.reference_angle = round.get("reference_angle", "A")
		_pad.queue_redraw()
		_prompt_label.text = "Reference angle %s: drag the three side labels into the correct edge slots." % round.get("reference_angle", "A")
		for side_id in ["AB", "BC", "AC"]:
			var slot := DropSlot.new()
			slot.configure(side_id, side_id)
			_slot_container.add_child(slot)
			_slot_map[side_id] = slot
		for token_id in ["opposite", "adjacent", "hypotenuse"]:
			var token := DraggableToken.new()
			token.configure(token_id, token_id.capitalize())
			_token_container.add_child(token)
	else:
		_prompt_label.text = "Drag the vertices until the triangle matches the target shape, then check it."
		for card in payload.get("verification_cards", []):
			var token := DraggableToken.new()
			token.configure(card.answer, "%s -> %s" % [card.prompt, card.answer])
			_token_container.add_child(token)


func _confirm_round() -> void:
	var payload := level_data.get("template_payload", {})
	var mode := payload.get("mode", "label_sides")
	if mode == "label_sides":
		var round := _rounds[_round_index]
		var expected := round.get("correct_mapping", {})
		var translated := {}
		for role in expected.keys():
			translated[String(expected[role])] = String(role)
		for side_id in translated.keys():
			var slot: DropSlot = _slot_map[side_id]
			if slot.placed_token_id != String(translated[side_id]).to_lower():
				register_mistake("One or more side labels are still in the wrong place.")
				return
		register_success("Perfect labeling. The triangle roles changed exactly as expected.")
		_correct_rounds += 1
		_round_index += 1
		if _round_index >= _rounds.size():
			finish_level(float(_correct_rounds) / max(1.0, float(_rounds.size())))
		else:
			_load_round()
	else:
		if _pad.matches_goal():
			register_success("The triangle geometry now matches the target family.")
			finish_level(1.0)
		else:
			register_mistake("The triangle is close, but the target angle pattern is not there yet.")
