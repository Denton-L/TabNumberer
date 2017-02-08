"use strict";

var originalTitle = null;
var controlledChange = false;
var lastNumber = 0;

function emitKeyEvent(isKeyDown) {
	return {
		message: "keyEvent",
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

function isListenableKeyEvent(event) {
	var keyCode = event.keyCode;

	return navigator.appVersion.indexOf("Mac") > 0 ?
		keyCode === 91 || keyCode === 93 :
		keyCode === 17;
}

window.addEventListener("keydown", function (event) {
	if (isListenableKeyEvent(event)) {
		chrome.runtime.sendMessage(emitKeyEvent(true));
	}
});

window.addEventListener("keyup", function (event) {
	if (isListenableKeyEvent(event)) {
		chrome.runtime.sendMessage(emitKeyEvent(false));
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
