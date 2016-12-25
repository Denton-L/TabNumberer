"use strict";

var control_keycode = 17;

function emitCtrlEvent(isKeyDown) {
	return {
		"message": "ctrl_event",
		"is_keydown": isKeyDown
	};
}

window.addEventListener("keydown", function(event) {
	if (event.keyCode == control_keycode) {
		chrome.runtime.sendMessage(emitCtrlEvent(true));
	}
});

window.addEventListener("keyup", function(event) {
	if (event.keyCode == control_keycode) {
		chrome.runtime.sendMessage(emitCtrlEvent(false));
	}
});
