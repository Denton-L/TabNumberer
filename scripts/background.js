"use strict";

var keyDownCount = 0;

function numberTabs() {
	chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, function (tabs) {
		tabs.forEach(function (tab) {
			chrome.tabs.sendMessage(tab.id, {
				message: "titleEvent",
				tabNumber: (keyDownCount > 0 && tab.index < 9) ? tab.index + 1 : 0
			});
		});
	});
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (sender.id === chrome.runtime.id && message.message === "ctrlEvent") {
		if (message.isKeyDown) {
			keyDownCount++;
		} else {
			keyDownCount = Math.max(0, keyDownCount - 1);
		}

		numberTabs();
	}
});

chrome.tabs.onActivated.addListener(function (tab) {
	keyDownCount = 0;
	numberTabs();
});
