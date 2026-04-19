extends PanelContainer
class_name DropSlot

signal token_dropped(slot_id: String, token_id: String, token_text: String)

var slot_id := ""
var accepted_token_ids: Array = []
var placed_token_id := ""
var placed_text := ""
var _label: Label


func _ready() -> void:
	custom_minimum_size = Vector2(190, 62)
	self_modulate = Color("17283f")
	if _label == null:
		_label = Label.new()
		_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		add_child(_label)
	_refresh()


func configure(id_value: String, prompt_text: String, valid_tokens: Array = []) -> void:
	slot_id = id_value
	placed_text = prompt_text
	accepted_token_ids = valid_tokens
	if _label != null:
		_refresh()


func _can_drop_data(_at_position: Vector2, data: Variant) -> bool:
	if typeof(data) != TYPE_DICTIONARY:
		return false
	var candidate := String(data.get("token_id", ""))
	if accepted_token_ids.is_empty():
		return true
	return accepted_token_ids.has(candidate)


func _drop_data(_at_position: Vector2, data: Variant) -> void:
	placed_token_id = String(data.get("token_id", ""))
	placed_text = String(data.get("token_text", ""))
	_refresh()
	token_dropped.emit(slot_id, placed_token_id, placed_text)


func clear_slot(prompt_text: String = "") -> void:
	placed_token_id = ""
	if not prompt_text.is_empty():
		placed_text = prompt_text
	_refresh()


func _refresh() -> void:
	if _label == null:
		return
	_label.text = placed_text if not placed_text.is_empty() else slot_id
