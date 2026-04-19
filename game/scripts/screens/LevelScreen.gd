extends Control

signal back_requested()

var _level: Dictionary = {}
var _template_instance: Control
var _body: VBoxContainer
var _summary_panel: PanelContainer


func _ready() -> void:
	_build_layout()


func load_level(level_id: String) -> void:
	_level = ChapterRepository.get_level(level_id)
	if is_node_ready():
		_show_level()


func _build_layout() -> void:
	var background := ColorRect.new()
	background.color = Color("0f1726")
	background.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(background)

	var margin := MarginContainer.new()
	margin.set_anchors_preset(Control.PRESET_FULL_RECT)
	margin.add_theme_constant_override("margin_left", 28)
	margin.add_theme_constant_override("margin_right", 28)
	margin.add_theme_constant_override("margin_top", 24)
	margin.add_theme_constant_override("margin_bottom", 24)
	add_child(margin)

	_body = VBoxContainer.new()
	_body.size_flags_vertical = Control.SIZE_EXPAND_FILL
	_body.add_theme_constant_override("separation", 18)
	margin.add_child(_body)

	var back_button := Button.new()
	back_button.name = "BackButton"
	back_button.text = "Back to map"
	back_button.pressed.connect(func() -> void:
		back_requested.emit()
	)
	_body.add_child(back_button)

	_summary_panel = PanelContainer.new()
	_summary_panel.visible = false
	_body.add_child(_summary_panel)

	if not _level.is_empty():
		_show_level()


func _show_level() -> void:
	if _level.is_empty():
		return

	for child in _body.get_children():
		if child != _summary_panel and child.name != "BackButton":
			child.queue_free()
	_summary_panel.visible = false

	var header := Label.new()
	header.text = "%s\n%s" % [_level.title, _level.objective]
	header.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	header.add_theme_font_size_override("font_size", 26)
	_body.add_child(header)

	var competence := Label.new()
	competence.text = "Competencies: %s" % ", ".join(PackedStringArray(_level.competency_tags))
	competence.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	competence.modulate = Color("b7d4ef")
	_body.add_child(competence)

	var template_scene := ChapterRepository.get_template_scene(_level.template_id)
	if template_scene == null:
		return
	_template_instance = template_scene.instantiate()
	_template_instance.completed.connect(_on_template_completed)
	_template_instance.setup_level(_level)
	_body.add_child(_template_instance)


func _on_template_completed(result: Dictionary) -> void:
	AppState.complete_level(result)
	_render_summary(result)


func _render_summary(result: Dictionary) -> void:
	_summary_panel.visible = true
	for child in _summary_panel.get_children():
		child.queue_free()

	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 18)
	margin.add_theme_constant_override("margin_right", 18)
	margin.add_theme_constant_override("margin_top", 18)
	margin.add_theme_constant_override("margin_bottom", 18)
	_summary_panel.add_child(margin)

	var stack := VBoxContainer.new()
	stack.add_theme_constant_override("separation", 12)
	margin.add_child(stack)

	var title := Label.new()
	title.text = "Level complete"
	title.add_theme_font_size_override("font_size", 24)
	stack.add_child(title)

	var details := Label.new()
	details.text = "Accuracy: %d%%  |  Stars: %d  |  XP gained: %d" % [
		int(round(result.get("accuracy", 0.0) * 100.0)),
		int(result.get("stars", 0)),
		int(result.get("xp_awarded", 0))
	]
	details.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	stack.add_child(details)

	var encouragement := Label.new()
	encouragement.text = result.get("encouragement", "Great work. You can retry or continue when you are ready.")
	encouragement.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	encouragement.modulate = Color("ffd27d")
	stack.add_child(encouragement)

	var buttons := HBoxContainer.new()
	buttons.add_theme_constant_override("separation", 12)
	stack.add_child(buttons)

	var retry_button := Button.new()
	retry_button.text = "Retry"
	retry_button.pressed.connect(func() -> void:
		_summary_panel.visible = false
		if _template_instance != null:
			_template_instance.queue_free()
			_template_instance = null
		_show_level()
	)
	buttons.add_child(retry_button)

	var next_level_id := ChapterRepository.get_next_level_id(_level.id)
	if not next_level_id.is_empty() and AppState.is_level_unlocked(next_level_id):
		var next_button := Button.new()
		next_button.text = "Next level"
		next_button.pressed.connect(func() -> void:
			_summary_panel.visible = false
			if _template_instance != null:
				_template_instance.queue_free()
				_template_instance = null
			load_level(next_level_id)
		)
		buttons.add_child(next_button)

	var map_button := Button.new()
	map_button.text = "World map"
	map_button.pressed.connect(func() -> void:
		back_requested.emit()
	)
	buttons.add_child(map_button)
