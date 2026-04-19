extends BaseTemplate

var _prompt_label: Label
var _slot_container: FlowContainer
var _token_container: FlowContainer
var _submit_button: Button
var _rounds: Array = []
var _round_index := 0
var _correct_rounds := 0
var _slots: Array = []


func setup_level(data: Dictionary) -> void:
	super.setup_level(data)
	clear_interaction()
	_rounds = data.get("template_payload", {}).get("rounds", [])
	_round_index = 0
	_correct_rounds = 0
	_build_ui()
	_load_round()


func _build_ui() -> void:
	var root := get_interaction_root()
	_prompt_label = Label.new()
	_prompt_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	root.add_child(_prompt_label)

	_slot_container = FlowContainer.new()
	_slot_container.add_theme_constant_override("h_separation", 12)
	_slot_container.add_theme_constant_override("v_separation", 12)
	root.add_child(_slot_container)

	_token_container = FlowContainer.new()
	_token_container.add_theme_constant_override("h_separation", 12)
	_token_container.add_theme_constant_override("v_separation", 12)
	root.add_child(_token_container)

	_submit_button = Button.new()
	_submit_button.text = "Forge answer"
	_submit_button.pressed.connect(_confirm_round)
	root.add_child(_submit_button)


func _load_round() -> void:
	_slots.clear()
	for child in _slot_container.get_children():
		child.queue_free()
	for child in _token_container.get_children():
		child.queue_free()

	var round := _rounds[_round_index]
	_prompt_label.text = round.get("prompt", "")

	for slot_id in round.get("slots", []):
		var slot := DropSlot.new()
		slot.configure(slot_id, slot_id.capitalize())
		_slot_container.add_child(slot)
		_slots.append(slot)

	for token_id in round.get("tokens", []):
		var token := DraggableToken.new()
		token.configure(String(token_id).to_lower(), String(token_id))
		_token_container.add_child(token)


func _confirm_round() -> void:
	var round := _rounds[_round_index]
	var expected: Array = []
	for item in round.get("answer", []):
		expected.append(String(item).to_lower())

	var actual: Array = []
	for slot in _slots:
		actual.append(slot.placed_token_id)

	if actual == expected:
		register_success("Forged correctly. The ratio machine accepts the build.")
		_correct_rounds += 1
		_round_index += 1
		if _round_index >= _rounds.size():
			finish_level(float(_correct_rounds) / max(1.0, float(_rounds.size())))
		else:
			_load_round()
	else:
		register_mistake("The forge rejected that build. Recheck the numerator and denominator story.")
