/*
 * @Author: W·S
 * @Date: 2022-03-12 10:55:04
 * @LastEditors: W·S
 * @LastEditTime: 2022-05-30 14:54:09
 * @Description:
 */
const ACTIONSCMD = "INVOKE";
const ACTIONSEMP = "EMPOWER";
const ACTIONSIGN = "SIGN";
const ACTIONACCOUNT = "ACCOUNT";
let windowId = "";

chrome.runtime.onInstalled.addListener(() => {
  console.log("numbers");
});

let numbers = 0;
console.log("numbers", numbers);
chrome.runtime.onMessage.addListener((message, sender, callback) => {
  if (message.cmd)
    switch (message.cmd) {
      case ACTIONSIGN:
        openWindow(message.data, "sign");
        break;
      case ACTIONACCOUNT:
        openWindow(message.data, "account");
        break;
      case ACTIONSEMP:
        chrome.tabs.create(
          { url: chrome.runtime.getURL("popup.html") },
          () => {}
        );
        break;
      case "ddc_addSign":
        numbers += 10;
        callback(numbers);
        return;
      case "ddc_sign":
        callback(numbers);
        return;
      default:
        break;
    }
  callback(null);
});

// Fired when a window is removed (closed).
chrome.windows.onRemoved.addListener(() => {
  // Gets all windows.
  chrome.windows.getAll(function (windowList) {
    // Close all windows
    console.log("windowList", windowList.length);
    if (windowList.length == 0) {
      setLocal("STATES", "0").then(() => {
        console.log("0");
        sessionStorage.setItem("numbers", 0);
      });
    }
  });
});

async function openWindow(_data, _type) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    if (windowId > 0) chrome.windows.remove(windowId);
    const NOTIFICATION_WIDTH = 390;
    const NOTIFICATION_HEIGHT = 620;
    const _window = await getLastFocused({ populate: true });
    let tabs = {};
    _window.tabs.forEach((element) => {
      if (element.active) return (tabs = element);
    });

    setLocal(_type === "sign" ? "ddcSign" : "ddcAddAccount", {
      tabId: tabs.id,
      data: _data,
    }).then(() => {
      chrome.windows.create(
        {
          url: "popup.html",
          focused: true,
          type: "popup",
          width: NOTIFICATION_WIDTH,
          height: NOTIFICATION_HEIGHT,
          left: _window.left + (_window.width - NOTIFICATION_WIDTH),
          top: _window.top,
        },
        (newWindow) => {
          const error = checkForError();
          if (error) {
            return reject(error);
          }
          windowId = newWindow.id;
          return resolve(newWindow);
        }
      );
    });
  });
}

async function getLastFocused(queryOptions, callback) {
  return new Promise((resolve, reject) => {
    chrome.windows.getLastFocused(queryOptions, (_window) => {
      const error = checkForError();
      if (error) {
        return reject(error);
      }
      callback && callback(_window);
      return resolve(_window);
    });
  });
}

async function setLocal(key, val) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: val }, () => {
      const error = checkForError();
      if (error) {
        return reject(error);
      }
      return resolve("");
    });
  });
}

function checkForError() {
  const { lastError } = chrome.runtime;
  if (!lastError) {
    return undefined;
  }
  // if it quacks like an Error, its an Error
  if (lastError.stack && lastError.message) {
    return lastError;
  }
  // repair incomplete error object (eg chromium v77)
  return new Error(lastError.message);
}
