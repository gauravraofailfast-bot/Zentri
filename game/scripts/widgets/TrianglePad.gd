extends Control
class_name TrianglePad

signal geometry_changed()

var mode := "label_sides"
var reference_angle := "A"
var goal: Dictionary = {}
var vertices := {
	"A": Vector2(0.18, 0.82),
	"B": Vector2(0.82, 0.82),
	"C": Vector2(0.82, 0.22)
}

var _drag_vertex := ""


func _ready() -> void:
	custom_minimum_size = Vector2(520, 380)
	queue_redraw()


func configure(new_mode: String, new_vertices: Dictionary, new_reference_angle: String = "A", new_goal: Dictionary = {}) -> void:
	mode = new_mode
	for key in new_vertices.keys():
		vertices[key] = Vector2(new_vertices[key][0], new_vertices[key][1])
	reference_angle = new_reference_angle
	goal = new_goal
	queue_redraw()


func _gui_input(event: InputEvent) -> void:
	if mode != "construct_by_drag":
		return
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		if event.pressed:
			_drag_vertex = _pick_vertex(event.position)
		else:
			_drag_vertex = ""
	elif event is InputEventMouseMotion and not _drag_vertex.is_empty():
		_move_vertex(_drag_vertex, event.position)
	elif event is InputEventScreenTouch:
		if event.pressed:
			_drag_vertex = _pick_vertex(event.position)
		else:
			_drag_vertex = ""
	elif event is InputEventScreenDrag and not _drag_vertex.is_empty():
		_move_vertex(_drag_vertex, event.position)


func _pick_vertex(position: Vector2) -> String:
	for key in ["A", "B", "C"]:
		if position.distance_to(_real_vertex(key)) < 30.0:
			return key
	return ""


func _move_vertex(vertex_id: String, position: Vector2) -> void:
	var x := clamp(position.x / size.x, 0.08, 0.92)
	var y := clamp(position.y / size.y, 0.1, 0.9)
	vertices[vertex_id] = Vector2(x, y)
	queue_redraw()
	geometry_changed.emit()


func get_side_slots() -> Dictionary:
	return {
		"AB": (_real_vertex("A") + _real_vertex("B")) * 0.5,
		"BC": (_real_vertex("B") + _real_vertex("C")) * 0.5,
		"AC": (_real_vertex("A") + _real_vertex("C")) * 0.5
	}


func matches_goal() -> bool:
	if goal.get("equal_legs", false):
		var ab := _real_vertex("A").distance_to(_real_vertex("B"))
		var bc := _real_vertex("B").distance_to(_real_vertex("C"))
		return absf(ab - bc) < 20.0 and _contains_angle_set(goal.get("target_angles", []))
	if goal.get("equilateral_split", false):
		return _contains_angle_set(goal.get("target_angles", []))
	return false


func _contains_angle_set(target_angles: Array) -> bool:
	if target_angles.is_empty():
		return true
	var angles := _triangle_angles()
	angles.sort()
	var copy := target_angles.duplicate()
	copy.sort()
	for index in min(angles.size(), copy.size()):
		if absf(angles[index] - float(copy[index])) > 8.0:
			return false
	return true


func _triangle_angles() -> Array:
	var a := _real_vertex("A")
	var b := _real_vertex("B")
	var c := _real_vertex("C")
	return [
		_angle_at(a, b, c),
		_angle_at(b, a, c),
		_angle_at(c, a, b)
	]


func _angle_at(vertex: Vector2, p1: Vector2, p2: Vector2) -> float:
	var v1 := (p1 - vertex).normalized()
	var v2 := (p2 - vertex).normalized()
	return rad_to_deg(acos(clamp(v1.dot(v2), -1.0, 1.0)))


func _real_vertex(vertex_id: String) -> Vector2:
	var point: Vector2 = vertices[vertex_id]
	return Vector2(point.x * size.x, point.y * size.y)


func _draw() -> void:
	var a := _real_vertex("A")
	var b := _real_vertex("B")
	var c := _real_vertex("C")
	draw_line(a, b, Color("8fd3ff"), 4.0)
	draw_line(b, c, Color("8fd3ff"), 4.0)
	draw_line(a, c, Color("ffd27d"), 4.0)
	for key in ["A", "B", "C"]:
		var point := _real_vertex(key)
		draw_circle(point, 16.0, Color("20314a"))
		draw_circle(point, 12.0, Color("8fd3ff") if key == reference_angle else Color("dcecff"))
		draw_string(get_theme_default_font(), point + Vector2(14, -12), key, HORIZONTAL_ALIGNMENT_LEFT, -1, 18, Color("dcecff"))
	if mode == "construct_by_drag":
		draw_string(get_theme_default_font(), Vector2(16, 28), "Drag the vertices until the target shape is achieved.", HORIZONTAL_ALIGNMENT_LEFT, -1, 18, Color("dcecff"))
