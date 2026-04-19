extends Control
class_name MeasurementPad

signal angle_changed(value: float)

var target_angle := 45.0
var current_angle := 15.0
var tolerance := 5.0
var _dragging := false


func _ready() -> void:
	custom_minimum_size = Vector2(520, 360)
	queue_redraw()


func set_target(angle_value: float, tolerance_value: float) -> void:
	target_angle = clamp(angle_value, 0.0, 90.0)
	tolerance = tolerance_value
	current_angle = clamp(current_angle, 0.0, 90.0)
	queue_redraw()


func is_target_hit() -> bool:
	return absf(target_angle - current_angle) <= tolerance


func _gui_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		_dragging = event.pressed
		if _dragging:
			_update_angle(event.position)
	elif event is InputEventMouseMotion and _dragging:
		_update_angle(event.position)
	elif event is InputEventScreenTouch:
		_dragging = event.pressed
		if _dragging:
			_update_angle(event.position)
	elif event is InputEventScreenDrag and _dragging:
		_update_angle(event.position)


func _update_angle(pointer: Vector2) -> void:
	var origin := Vector2(80, size.y - 70)
	var raw_angle := rad_to_deg((origin - pointer).angle_to_point(Vector2(origin.x + 120, origin.y)))
	var vec := pointer - origin
	var angle := clamp(rad_to_deg(-vec.angle()), 0.0, 90.0)
	if pointer.y > origin.y:
		angle = 0.0
	current_angle = angle
	queue_redraw()
	angle_changed.emit(current_angle)


func _draw() -> void:
	var origin := Vector2(80, size.y - 70)
	var baseline_end := origin + Vector2(360, 0)
	draw_line(origin, baseline_end, Color("8aa7c7"), 4.0)
	draw_arc(origin, 100.0, deg_to_rad(-90.0), deg_to_rad(0.0), 24, Color("304b6f"), 2.0)
	_draw_ray(origin, target_angle, Color("ffd27d"), 3.0)
	_draw_ray(origin, current_angle, Color("8fd3ff"), 5.0)
	draw_string(get_theme_default_font(), Vector2(24, 28), "Target: %.0f deg" % target_angle, HORIZONTAL_ALIGNMENT_LEFT, -1, 22, Color("ffd27d"))
	draw_string(get_theme_default_font(), Vector2(24, 56), "Current: %.1f deg" % current_angle, HORIZONTAL_ALIGNMENT_LEFT, -1, 18, Color("d9ebff"))


func _draw_ray(origin: Vector2, angle_value: float, color: Color, width: float) -> void:
	var radians := deg_to_rad(-angle_value)
	var endpoint := origin + Vector2(cos(radians), sin(radians)) * 240.0
	draw_line(origin, endpoint, color, width)
