/*
 * @Author: W·S
 * @Date: 2022-03-09 10:16:29
 * @LastEditors: W·S
 * @LastEditTime: 2022-04-18 14:54:58
 * @Description:
 */
import { ExtensionPlatform } from "@/utils/platforms/extension";
import { DDCSDB } from "@/utils/platforms/cryptography";
import { isEmpty } from "@/utils/tools";

export default (refelForms: any, elForms: any) => {
  const ddcsdb = new DDCSDB();
  const extension = new ExtensionPlatform();
  const elValidator = async (rule: any, value: any, callback: Function) => {
    if (isEmpty(value))
      return callback(new Error(extension.i18n("DDC_Box_1030_1")));
    if (value.length < 8)
      return callback(new Error(extension.i18n("DDC_Box_1009_2")));
    if (elForms.val_pas === "true") {
      const boo = await ddcsdb.checkPassW(elForms.ddcPwd);
      if (!boo) {
        return callback(new Error(extension.i18n("DDC_Box_1037")));
      }
    }
    callback();
  };
  const elFormsRules = {
    ddcPwd: {
      required: true,
      validator: elValidator,
      trigger: "change",
    },
  };

  return () => (
    <el-form
      ref={refelForms}
      model={elForms}
      rules={elFormsRules}
      class="bsn-w-250"
      label-position="top"
    >
      <el-form-item class="bsn-mb-0" prop="val_pas" />
      <el-form-item class="wel-form-input" prop="ddcPwd">
        {{
          default: () => (
            <el-input
              v-model={elForms.ddcPwd}
              placeholder={extension.i18n("DDC_Box_1030")}
              size="large"
              maxlength="20"
              autocomplete="new-password"
              class="bsn-h-50 bsn-f-14"
              type="password"
            ></el-input>
          ),
        }}
      </el-form-item>
    </el-form>
  );
};
