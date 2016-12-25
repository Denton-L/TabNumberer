"use strict";

var keyDownCount = 0;

function numberTabs(isKeyDown) {
	if (isKeyDown) {
		keyDownCount++;
	} else {
		keyDownCount--;
	}

	chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, function (tabs) {
		tabs.forEach(function (tab) {
			chrome.tabs.sendMessage(tab.id, {
				message: "titleEvent",
				tabNumber: (keyDownCount > 0 && tab.index < 10) ? tab.index + 1 : 0
			});
		});
	});
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (sender.id === chrome.runtime.id && message.message === "ctrlEvent") {
		numberTabs(message.isKeyDown);
	}
});