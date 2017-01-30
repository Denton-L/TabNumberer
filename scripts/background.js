"use strict";

var keyDownCount = 0;

function numberTabs() {
	chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, function (tabs) {
		tabs.forEach(function (tab) {
			var number;
			if (keyDownCount > 0) {
				if (tab.index < 8) {
					number = tab.index + 1;
				} else if (tab.index == tabs.length - 1) {
					number = 9;
				} else {
					number = 0;
				}
			} else {
				number = 0;
			}
			chrome.tabs.sendMessage(tab.id, {
				message: "titleEvent",
				tabNumber: number
			});
		});
	});
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (sender.id === chrome.runtime.id) {
		switch (message.message) {
			case "ctrlEvent":
				if (message.isKeyDown) {
					keyDownCount++;
				} else {
					keyDownCount = Math.max(0, keyDownCount - 1);
				}
				break;
			case "setKeyCount":
				keyDownCount = message.count;
				break;
		}

		numberTabs();
	}
});
