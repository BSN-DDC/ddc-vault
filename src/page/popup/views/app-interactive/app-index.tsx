/*
 * @Author: W·S
 * @Date: 2022-04-20 16:57:05
 * @LastEditors: W·S
 * @LastEditTime: 2022-04-27 14:10:13
 * @FilePath: /ddcvault/src/page/popup/views/app-interactive/app-index.tsx
 * @Description:
 */
import { useMixin } from "@/mixin";
import { defineComponent, reactive, ref } from "vue";
import { ExtensionPlatform } from "@/utils/platforms/extension";
import { DDCSDB } from "@/utils/platforms/cryptography";
import { throttle } from "@/utils/tools";
import CustomForm from "../../components/CustomForm";

export default defineComponent({
  setup() {
    const refelForms: any = ref(null);
    const { Router } = useMixin();
    const ddcsdb = new DDCSDB();
    const extension = new ExtensionPlatform();
    const elForms = reactive({
      ddcPwd: "",
      val_pas: "false",
    });
    const com_form = CustomForm(refelForms, elForms);

    const verifyPwd = throttle(() => {
      elForms.val_pas = "true";
      refelForms.value.validate((valid: any) => {
        if (valid) {
          const logIn = async () => {
            return new Promise((resolve) => {
              extension.platform.runtime.sendMessage(
                { cmd: "ddc_addSign", data: "" },
                (response: any) => {
                  resolve(response);
                }
              );
            });
          };
          Promise.all([ddcsdb.setDdcSta("10"), logIn()]).then(() => {
            setTimeout(() => {
              Router.push({ name: "AppHome" });
            }, 300);
          });
        } else elForms.val_pas = "false";
      });
    }, 2000);

    const submitForm = (el: string) => {
      if (el === "login") {
        verifyPwd();
      } else {
        window.open(
          extension.platform.runtime.getURL("home.html#/create-pwd?stepNode=22")
        );
      }
    };

    return () => (
      <div
        class="bsn-box bsn-box-f1 bsn-box-ver bsn-box-ac bsn-box-pc"
        style="background-color:#F9F9FB"
      >
        <p class="bsn-ta-center">
          <span class="bsn-f-30 bsn-f-wb">
            {" " + extension.i18n("DDC_Box_1028")}
          </span>
        </p>
        <p class="bsn-mb-54 bsn-c-theme2 bsn-f-14">
          {extension.i18n("DDC_Box_1029")}
        </p>
        <com_form></com_form>
        <el-button
          type="primary"
          class="bsn-w-250 bsn-h-50 bsn-f-18 bsn-f-wb act-main bsn-mt-28"
          onClick={() => submitForm("login")}
        >
          {extension.i18n("DDC_Box_1031")}
        </el-button>
        <div class="bsn-mt-20 bsn-mb-120 bsn-f-14">
          <span class="">{extension.i18n("DDC_Box_1032")}</span>
          <span
            class="bsn-ml-4 bsn-c-theme2 ucp"
            onClick={() => submitForm("import")}
          >
            {extension.i18n("DDC_Box_1033")}
          </span>
        </div>
      </div>
    );
  },
});
