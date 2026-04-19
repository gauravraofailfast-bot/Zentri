extends BaseTemplate

var _prompt_label: Label
var _tile_flow: FlowContainer
var _timer_label: Label
var _timer: Timer
var _rounds: Array = []
var _round_index := 0
var _correct := 0
var _remaining_time := 30


func setup_level(data: Dictionary) -> void:
	super.setup_level(data)
	clear_interaction()
	_rounds = data.get("template_payload", {}).get("rounds", [])
	_round_index = 0
	_correct = 0
	_remaining_time = int(data.get("template_payload", {}).get("time_limit_seconds", 30))
	_build_ui()
	_load_round()
	_timer.start()


func _build_ui() -> void:
	var root := get_interaction_root()
	_timer_label = Label.new()
	root.add_child(_timer_label)

	_prompt_label = Label.new()
	_prompt_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	_prompt_label.add_theme_font_size_override("font_size", 24)
	root.add_child(_prompt_label)

	_tile_flow = FlowContainer.new()
	_tile_flow.add_theme_constant_override("h_separation", 12)
	_tile_flow.add_theme_constant_override("v_separation", 12)
	root.add_child(_tile_flow)

	_timer = Timer.new()
	_timer.wait_time = 1.0
	_timer.autostart = false
	_timer.timeout.connect(_tick)
	add_child(_timer)


func _tick() -> void:
	_remaining_time -= 1
	_timer_label.text = "Time left: %d s" % _remaining_time
	if _remaining_time <= 0:
		_timer.stop()
		finish_level(float(_correct) / max(1.0, float(_rounds.size())), {
			"encouragement": "The timer ended, but the arena keeps your progress. Retry to sharpen recall."
		})


func _load_round() -> void:
	if _round_index >= _rounds.size():
		_timer.stop()
		finish_level(float(_correct) / max(1.0, float(_rounds.size())))
		return

	for child in _tile_flow.get_children():
		child.queue_free()
	var round := _rounds[_round_index]
	_prompt_label.text = round.get("prompt", "")
	_timer_label.text = "Time left: %d s" % _remaining_time

	for option in round.get("options", []):
		var button := Button.new()
		button.text = option
		button.custom_minimum_size = Vector2(200, 64)
		button.pressed.connect(_check_answer.bind(String(option)))
		_tile_flow.add_child(button)


func _check_answer(choice: String) -> void:
	var round := _rounds[_round_index]
	if choice == String(round.get("answer", "")):
		_correct += 1
		register_success("Clean recall. Keep the streak alive.")
	else:
		register_mistake("Not quite. That prompt will come back through revision.")
	_round_index += 1
	_load_round()
