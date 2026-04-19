extends BaseTemplate

var _expression_label: Label
var _sequence_flow: FlowContainer
var _move_flow: FlowContainer
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
	_expression_label = Label.new()
	_expression_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	_expression_label.add_theme_font_size_override("font_size", 24)
	root.add_child(_expression_label)

	_sequence_flow = FlowContainer.new()
	_sequence_flow.add_theme_constant_override("h_separation", 12)
	_sequence_flow.add_theme_constant_override("v_separation", 12)
	root.add_child(_sequence_flow)

	_move_flow = FlowContainer.new()
	_move_flow.add_theme_constant_override("h_separation", 12)
	_move_flow.add_theme_constant_override("v_separation", 12)
	root.add_child(_move_flow)

	_submit_button = Button.new()
	_submit_button.text = "Run reactor"
	_submit_button.pressed.connect(_confirm_round)
	root.add_child(_submit_button)


func _load_round() -> void:
	_slots.clear()
	for child in _sequence_flow.get_children():
		child.queue_free()
	for child in _move_flow.get_children():
		child.queue_free()

	var round := _rounds[_round_index]
	_expression_label.text = round.get("expression", "")

	for index in round.get("answer", []).size():
		var slot := DropSlot.new()
		slot.configure("step_%d" % index, "Step %d" % (index + 1))
		_sequence_flow.add_child(slot)
		_slots.append(slot)

	for move in round.get("moves", []):
		var token := DraggableToken.new()
		token.configure(move.get("id", ""), move.get("label", ""))
		_move_flow.add_child(token)


func _confirm_round() -> void:
	var round := _rounds[_round_index]
	var actual: Array = []
	for slot in _slots:
		actual.append(slot.placed_token_id)

	var expected: Array = []
	for item in round.get("answer", []):
		expected.append(String(item))

	if actual == expected:
		register_success("Stable reaction. Every step was logically valid.")
		_correct_rounds += 1
		_round_index += 1
		if _round_index >= _rounds.size():
			finish_level(float(_correct_rounds) / max(1.0, float(_rounds.size())))
		else:
			_load_round()
	else:
		register_mistake("The reactor sequence is invalid. Reorder the proof moves.")
