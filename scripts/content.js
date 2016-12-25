"use strict";

var controlKeycode = 17;

var originalTitle = null;

function emitCtrlEvent(isKeyDown) {
	return {
		message: "ctrlEvent",
		isKeyDown: isKeyDown
	};
}

window.addEventListener("keydown", function (event) {
	if (event.keyCode === controlKeycode) {
		chrome.runtime.sendMessage(emitCtrlEvent(true));
	}
});

window.addEventListener("keyup", function (event) {
	if (event.keyCode === controlKeycode) {
		chrome.runtime.sendMessage(emitCtrlEvent(false));
	}
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (sender.id === chrome.runtime.id && message.message === "titleEvent") {
		if (message.tabNumber === 0 && originalTitle !== null) {
			document.title = originalTitle;
			originalTitle = null;
		} else if (message.tabNumber > 0 && originalTitle === null) {
			originalTitle = document.title;
			document.title = "(" + message.tabNumber + ") " + document.title;
		}
	}
});
