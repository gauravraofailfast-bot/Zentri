extends PanelContainer
class_name DraggableToken

var token_id := ""
var token_text := ""
var _label: Label


func _ready() -> void:
	mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	custom_minimum_size = Vector2(180, 52)
	self_modulate = Color("2a476f")
	if _label == null:
		_label = Label.new()
		_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		add_child(_label)
	_label.text = token_text


func configure(id_value: String, label_text: String) -> void:
	token_id = id_value
	token_text = label_text
	if _label != null:
		_label.text = token_text


func _get_drag_data(_at_position: Vector2) -> Variant:
	var preview := Label.new()
	preview.text = token_text
	preview.modulate = Color("ffffff")
	set_drag_preview(preview)
	return {"token_id": token_id, "token_text": token_text}
