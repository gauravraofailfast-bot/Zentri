extends ScrollContainer

signal level_selected(level_id: String)


func _ready() -> void:
	size_flags_vertical = Control.SIZE_EXPAND_FILL
	_build_content()


func _build_content() -> void:
	var content := VBoxContainer.new()
	content.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	content.add_theme_constant_override("separation", 20)
	add_child(content)

	var intro := Label.new()
	intro.text = "Choose a world and continue the mastery path. Every world ends with a mastery gate and targeted revision."
	intro.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	intro.modulate = Color("c4d9ef")
	content.add_child(intro)

	for world in ChapterRepository.get_worlds():
		content.add_child(_build_world_card(world))

	if not AppState.get_revision_queue().is_empty():
		var revision := Label.new()
		revision.text = "Revision queue: %s" % ", ".join(PackedStringArray(AppState.get_revision_queue()))
		revision.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		revision.modulate = Color("ffd27d")
		content.add_child(revision)


func _build_world_card(world: Dictionary) -> PanelContainer:
	var panel := PanelContainer.new()
	panel.custom_minimum_size = Vector2(0, 240)
	panel.self_modulate = Color("223a5c") if AppState.is_world_unlocked(world.id) else Color("1a2535")

	var wrapper := MarginContainer.new()
	wrapper.add_theme_constant_override("margin_left", 18)
	wrapper.add_theme_constant_override("margin_right", 18)
	wrapper.add_theme_constant_override("margin_top", 18)
	wrapper.add_theme_constant_override("margin_bottom", 18)
	panel.add_child(wrapper)

	var stack := VBoxContainer.new()
	stack.add_theme_constant_override("separation", 12)
	wrapper.add_child(stack)

	var title := Label.new()
	title.text = "%d. %s" % [int(world.number), world.title]
	title.add_theme_font_size_override("font_size", 24)
	stack.add_child(title)

	var objective := Label.new()
	objective.text = world.learning_objective
	objective.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	objective.modulate = Color("d7ebff")
	stack.add_child(objective)

	var flow := FlowContainer.new()
	flow.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	flow.add_theme_constant_override("h_separation", 12)
	flow.add_theme_constant_override("v_separation", 12)
	stack.add_child(flow)

	for level in ChapterRepository.get_levels_for_world(world.id):
		flow.add_child(_build_level_button(level))

	return panel


func _build_level_button(level: Dictionary) -> Button:
	var unlocked := AppState.is_level_unlocked(level.id)
	var completed := not AppState.get_level_result(level.id).is_empty()

	var button := Button.new()
	button.custom_minimum_size = Vector2(240, 64)
	button.text = "%02d  %s" % [int(level.number), level.title]
	button.disabled = not unlocked
	button.alignment = HORIZONTAL_ALIGNMENT_LEFT
	button.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART

	if completed:
		var stars := int(AppState.get_level_result(level.id).get("stars", 0))
		button.text += "   [" + "*".repeat(stars) + "]"
	elif not unlocked:
		button.text += "  [locked]"

	button.pressed.connect(func() -> void:
		level_selected.emit(level.id)
	)
	return button
