/*
 * @Author: W·S
 * @Date: 2022-02-26 16:26:02
 * @LastEditors: W·S
 * @LastEditTime: 2022-04-18 16:39:26
 * @Description:
 */
const ACTIONSCMD = "INVOKE";
const ACTIONSEMP = "EMPOWER";
const ACTIONSIGN = "SIGN";
const ACTIONACCOUNT = "ACCOUNT";

const temp = document.createElement("script");
temp.setAttribute("type", "text/javascript");
temp.src = chrome.runtime.getURL("js/inject.js");
temp.onload = function () {
  (this as any).parentNode.removeChild(this);
};
document.body.appendChild(temp);
const panel = document.createElement("div");
panel.id = "ddc_extension";
document.body.appendChild(panel);

chrome.runtime.onMessage.addListener(function (
  request: any,
  sender: any,
  sendResponse: any
) {
  if (request.cmd && request.cmd === "signData") {
    localStorage.setItem("ddc_signData", request.signData);
    window.document.getElementById("ddc_extension")?.click();
    sendResponse(null);
  } else if (request.cmd && request.cmd === "accountData") {
    localStorage.setItem("ddc_accountData", request.accountData);
    window.document.getElementById("ddc_extension")?.click();
    sendResponse(null);
  }
});

window.addEventListener(
  "message",
  function (e) {
    if (e.data && e.data.cmd == ACTIONSCMD) {
      switch (e.data.code) {
        case ACTIONSIGN:
        case ACTIONACCOUNT:
        case ACTIONSEMP:
          chrome.runtime.sendMessage(
            { cmd: e.data.code, data: e.data.data },
            (response: any) => {
              console.log("response", response);
            }
          );
          break;
        default:
          break;
      }
    }
  },
  false
);
