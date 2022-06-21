/*
 * @Author: W·S
 * @Date: 2022-02-26 16:20:00
 * @LastEditors: W·S
 * @LastEditTime: 2022-05-18 17:17:40
 * @Description:
 */
const ACTIONSCMD = "INVOKE";
const ACTIONSEMP = "EMPOWER";
const ACTIONSIGN = "SIGN";
const ACTIONACCOUNT = "ACCOUNT";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class DDCExtension {
  ddc_empower(data) {
    window.postMessage({ cmd: ACTIONSCMD, code: ACTIONSEMP, data }, "*");
  }
  ddc_addAccount(data, callback) {
    window.postMessage({ cmd: ACTIONSCMD, code: ACTIONACCOUNT, data }, "*");
    window.document.getElementById("ddc_extension").onclick = () => {
      const ddc_accountData = localStorage.getItem("ddc_accountData");
      callback(ddc_accountData);
      localStorage.removeItem("ddc_accountData");
    };
  }
  ddc_sign(data, callback) {
    window.postMessage({ cmd: ACTIONSCMD, code: ACTIONSIGN, data }, "*");
    window.document.getElementById("ddc_extension").onclick = () => {
      const ddc_signData = localStorage.getItem("ddc_signData");
      callback(ddc_signData);
      localStorage.removeItem("ddc_signData");
    };
  }
}
