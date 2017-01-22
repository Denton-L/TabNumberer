"use strict";

var controlKeycode = 17;

var originalTitle = null;
var controlledChange = false;
var lastNumber = 0;

function emitCtrlEvent(isKeyDown) {
	return {
		message: "ctrlEvent",
		isKeyDown: isKeyDown
	};
}

function numberTitle() {
	controlledChange = true;
	originalTitle = document.title;
	document.title = lastNumber + ". " + document.title;
}

function unNumberTitle() {
	document.title = originalTitle;
	originalTitle = null;
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

window.addEventListener("blur", function (event) {
	chrome.runtime.sendMessage({
		message: "setKeyCount",
		count: 0
	});
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (sender.id === chrome.runtime.id && message.message === "titleEvent") {
		lastNumber = message.tabNumber;
		if (lastNumber === 0 && originalTitle !== null) {
			unNumberTitle();
		} else if (lastNumber > 0 && originalTitle === null) {
			numberTitle();
		}
	}
});

window.onload = function () {
	new MutationObserver(function (mutations) {
		if (controlledChange) {
			controlledChange = false;
		} else if (lastNumber > 0) {
			numberTitle();
		}
	}).observe(document.querySelector("title"), {
		childList: true
	});
}
