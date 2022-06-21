/*
 * @Author: W·S
 * @Date: 2022-04-26 19:41:49
 * @LastEditors: W·S
 * @LastEditTime: 2022-04-27 19:42:46
 * @FilePath: /ddcvault/public/default_popup.js
 * @Description:
 */
(function () {
  chrome.storage.local.get(["MNEMONIC"], (result) => {
    if (result["MNEMONIC"]) {
      chrome.tabs.create(
        { url: chrome.runtime.getURL("popup.html") },
        () => {}
      );
    } else {
      chrome.tabs.create({ url: chrome.runtime.getURL("home.html") }, () => {});
    }
  });
})();
