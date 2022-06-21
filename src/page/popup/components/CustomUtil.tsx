/*
 * @Author: W·S
 * @Date: 2022-03-22 16:01:03
 * @LastEditors: W·S
 * @LastEditTime: 2022-04-19 13:50:16
 * @Description:
 */

import { ExtensionPlatform } from "@/utils/platforms/extension";
import { DDCSDB } from "@/utils/platforms/cryptography";
const extension = new ExtensionPlatform();
const ddcsdb = new DDCSDB();
export default (ElMessageBox: any, callBack: Function) => {
  ElMessageBox.prompt(
    extension.i18n("DDC_Box_1030_1"),
    extension.i18n("DDC_Box_2027"),
    {
      showClose: false,
      inputType: "password",
      closeOnClickModal: false,
      closeOnPressEscape: false,
      cancelButtonText: extension.i18n("DDC_Box_0004"),
      confirmButtonText: extension.i18n("DDC_Box_0004_1"),
      inputErrorMessage: extension.i18n("DDC_Box_1009_2"),
      inputValidator: (_value: any) => _value.length >= 8,
      beforeClose: async (action: string, instance: any, done: Function) => {
        if (action === "confirm") {
          const bol = await ddcsdb.checkPassW(instance.inputValue);
          if (!bol) {
            document.getElementsByClassName(
              "el-message-box__errormsg"
            )[0].innerHTML = extension.i18n("DDC_Box_1037");
            (document as any).getElementsByClassName(
              "el-message-box__errormsg"
            )[0].style.visibility = "visible";
          } else done();
        } else done();
      },
    }
  ).then((value: any) => {
    if (value.action === "confirm") {
      callBack(value.value);
    }
  });
};
