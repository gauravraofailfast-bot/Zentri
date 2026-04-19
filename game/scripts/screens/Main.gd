extends Control

const WORLD_MAP_SCENE := preload("res://scenes/ui/WorldMapScreen.tscn")
const LEVEL_SCREEN_SCENE := preload("res://scenes/ui/LevelScreen.tscn")

var _screen_host: MarginContainer
var _title_label: Label
var _meta_label: Label
var _current_screen: Control


func _ready() -> void:
	_build_shell()
	_show_world_map()


func _build_shell() -> void:
	var background := ColorRect.new()
	background.color = Color("101b2d")
	background.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(background)

	var glow := ColorRect.new()
	glow.color = Color(0.09, 0.28, 0.45, 0.35)
	glow.position = Vector2(120, 140)
	glow.size = Vector2(840, 520)
	add_child(glow)

	var chrome := MarginContainer.new()
	chrome.set_anchors_preset(Control.PRESET_FULL_RECT)
	chrome.add_theme_constant_override("margin_left", 36)
	chrome.add_theme_constant_override("margin_right", 36)
	chrome.add_theme_constant_override("margin_top", 32)
	chrome.add_theme_constant_override("margin_bottom", 32)
	add_child(chrome)

	var root := VBoxContainer.new()
	root.size_flags_vertical = Control.SIZE_EXPAND_FILL
	root.add_theme_constant_override("separation", 18)
	chrome.add_child(root)

	_title_label = Label.new()
	_title_label.text = "Zentri Phase 1"
	_title_label.add_theme_font_size_override("font_size", 34)
	root.add_child(_title_label)

	_meta_label = Label.new()
	_meta_label.text = "Android-first NCERT Chapters 8 and 9"
	_meta_label.modulate = Color("d6e8ff")
	root.add_child(_meta_label)

	_screen_host = MarginContainer.new()
	_screen_host.size_flags_vertical = Control.SIZE_EXPAND_FILL
	root.add_child(_screen_host)


func _clear_screen() -> void:
	if _current_screen != null:
		_current_screen.queue_free()
		_current_screen = null


func _show_world_map() -> void:
	_clear_screen()
	var screen := WORLD_MAP_SCENE.instantiate()
	screen.level_selected.connect(_open_level)
	_screen_host.add_child(screen)
	_current_screen = screen
	_meta_label.text = "XP %d  |  Stars %d" % [AppState.get_xp(), AppState.get_stars()]


func _open_level(level_id: String) -> void:
	_clear_screen()
	var screen := LEVEL_SCREEN_SCENE.instantiate()
	screen.back_requested.connect(_show_world_map)
	screen.load_level(level_id)
	_screen_host.add_child(screen)
	_current_screen = screen
