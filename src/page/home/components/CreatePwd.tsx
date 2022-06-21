/*
 * @Author: Feix
 * @Date: 2022-03-07 15:54:45
 * @LastEditors: W·S
 * @LastEditTime: 2022-05-16 23:11:27
 * @Description: Create password / Mnemonic import / Mnemonic recovery
 */

import { defineComponent, onMounted, ref, reactive } from "vue";
import { isEmpty } from "@/utils/tools";
import { useMixin } from "@/mixin";
import { DDCSDB } from "@/utils/platforms/cryptography";
import { ExtensionPlatform } from "@/utils/platforms/extension";
import { initAccounts } from "@/utils/accounts";
import { MnemonicAll } from "@/utils/algorithm/mnemonicAll";

export default defineComponent({
  name: "CreatePwd",
  setup() {
    interface DataInfoType {
      /**
       * 20:Create password
       * 21:Mnemonic import
       * 22:Mnemonic recovery
       */
      stepNode: number;
      showMnemonic: boolean;
    }

    interface ElFormsType {
      ddcMnemonic: string;
      ddcPwd: string;
      ddcPwdRe: string;
      // I have read and agree
      ddcTerms: boolean;
    }

    const iMnemonicAll = new MnemonicAll();
    const { Route, Router } = useMixin();
    const extension = new ExtensionPlatform();
    const ddcsdb = new DDCSDB();

    const dataInfo: DataInfoType = reactive({
      stepNode: 20,
      showMnemonic: false,
    });

    onMounted(() => {
      if (Route.query.stepNode) {
        dataInfo.stepNode = Number(Route.query.stepNode);
      }
    });

    // Create form responsive data
    const refelForms: any = ref(null);

    const elForms: ElFormsType = reactive({
      ddcMnemonic: "",
      ddcPwd: "",
      ddcPwdRe: "",
      ddcTerms: false,
    });

    // Custom validation
    const elValidator = (rule: any, value: any, callback: Function) => {
      let iValue: string, el: Array<string>, iArr: Array<number>, isValidate;
      switch (rule.field) {
        case "ddcMnemonic":
          if (isEmpty(value))
            return callback(new Error(extension.i18n("DDC_Box_1022")));
          iValue = initMnemonic(value);
          el = iValue.split(" ");
          iArr = [12, 15, 18, 21, 24];
          if (iArr.indexOf(el.length) == -1) {
            return callback(new Error(extension.i18n("DDC_Box_1039")));
          }
          isValidate = iMnemonicAll.isValidateMnemonic(iValue);
          if (!isValidate) {
            return callback(new Error(extension.i18n("DDC_Box_1040")));
          }
          break;
        case "ddcPwd":
          if (isEmpty(value))
            return callback(new Error(extension.i18n("DDC_Box_1009_1")));
          if (value.length < 8)
            return callback(new Error(extension.i18n("DDC_Box_1009_2")));
          if (
            elForms.ddcPwd != elForms.ddcPwdRe &&
            !isEmpty(elForms.ddcPwdRe)
          ) {
            return callback(new Error(extension.i18n("DDC_Box_1013")));
          } else {
            refelForms.value.clearValidate("ddcPwdRe");
          }
          break;
        case "ddcPwdRe":
          if (isEmpty(value))
            return callback(new Error(extension.i18n("DDC_Box_1010_1")));
          if (value.length < 8)
            return callback(new Error(extension.i18n("DDC_Box_1009_2")));
          if (elForms.ddcPwd != elForms.ddcPwdRe && !isEmpty(elForms.ddcPwd)) {
            return callback(new Error(extension.i18n("DDC_Box_1013")));
          } else {
            refelForms.value.clearValidate("ddcPwd");
          }
          break;
        case "ddcTerms":
          if (!value)
            return callback(new Error(extension.i18n("DDC_Box_1012_1")));
          break;
        default:
          break;
      }
      callback();
    };

    // Form field validation
    const elFormsRules = {
      ddcMnemonic: {
        required: true,
        validator: elValidator,
        trigger: "change",
      },
      ddcPwd: {
        required: true,
        validator: elValidator,
        trigger: "change",
      },
      ddcPwdRe: {
        required: true,
        validator: elValidator,
        trigger: "change",
      },
      ddcTerms: {
        required: true,
        validator: elValidator,
        trigger: "change",
      },
    };

    // Returns the parent route
    const routerBack = (num = -1) => Router.go(num);

    // Return/Submit/Create
    const submitForm = (el: string) => {
      if (el == "back") {
        routerBack();
      } else if (el == "save") {
        refelForms.value.validate((valid: any) => {
          if (valid) {
            createMnemonic();
          }
        });
      }
    };

    // Prevent connecting dots
    const clicktag = ref(0);

    //  Create mnemonic
    const createMnemonic = async () => {
      if (clicktag.value == 0) {
        clicktag.value = 1;
        setTimeout(() => {
          clicktag.value = 0;
        }, 2000);
      } else {
        return;
      }
      // Store password
      const iHash = await ddcsdb.setPassW(elForms.ddcPwd);
      if (dataInfo.stepNode == 20) {
        const params = {
          iHash,
        };
        // Go to the mnemonic page
        Router.push({ path: "mnemonic-box", query: params });
      } else if (dataInfo.stepNode == 21 || dataInfo.stepNode == 22) {
        elForms.ddcMnemonic = initMnemonic(elForms.ddcMnemonic);
        //  Initialize account
        await initAccounts(elForms.ddcMnemonic, iHash);
        window.open(
          extension.platform.runtime.getURL("popup.html#/app-index?stepNode=1"),
          "_top"
        );
      }
    };

    // Get title content
    const getTitle = () => {
      if (dataInfo.stepNode == 20) {
        return extension.i18n("DDC_Box_1008");
      } else if (dataInfo.stepNode == 21) {
        return extension.i18n("DDC_Box_1003");
      } else if (dataInfo.stepNode == 22) {
        return extension.i18n("DDC_Box_1034");
      }
    };

    const initMnemonic = (value: string): string => {
      const iMnemonic: string = value
        .replace(/(^\s*)|(\s*$)/g, "")
        .replace(/\s+/g, " ");
      return iMnemonic;
    };

    return () => (
      <>
        <div
          class="ucp bsn-bc-black bsn-c-white bsn-h-96"
          onClick={() => submitForm("back")}
          v-show={dataInfo.stepNode != 22}
        >
          <div class="bsn-pt-36 bsn-pl-130 bsn-f-20">
            {extension.i18n("DDC_Box_0003")}
          </div>
        </div>
        <el-card shadow="never" class="bsn-ml-130 bsn-mr-130 bsn-mt-40">
          <el-row>
            <el-col span={24}>
              <div class="bsn-f-36 bsn-mt-10">{getTitle()}</div>
              <el-form
                model={elForms}
                ref={refelForms}
                rules={elFormsRules}
                class="bsn-w-500 bsn-mt-20 bsn-ml-20"
                label-position="top"
                label-width="100px"
              >
                {dataInfo.stepNode == 21 || dataInfo.stepNode == 22 ? (
                  <>
                    <el-form-item
                      class="create-form-input"
                      label={extension.i18n("DDC_Box_1017")}
                      prop="ddcMnemonic"
                    >
                      <el-input
                        v-show={!dataInfo.showMnemonic}
                        v-model={elForms.ddcMnemonic}
                        size="large"
                        maxlength="200"
                        autocomplete="new-password"
                        type="password"
                      />
                      <el-input
                        v-show={dataInfo.showMnemonic}
                        v-model={elForms.ddcMnemonic}
                        size="large"
                        maxlength="200"
                        rows="3"
                        type="textarea"
                      />
                    </el-form-item>
                    <el-form-item class="create-form-input">
                      <el-checkbox
                        v-model={dataInfo.showMnemonic}
                        class="create-form-checkbox"
                        label={extension.i18n("DDC_Box_1035")}
                        size="large"
                      />
                    </el-form-item>
                  </>
                ) : null}

                <el-form-item
                  class="create-form-input bsn-mt-30"
                  label={extension.i18n("DDC_Box_1009")}
                  prop="ddcPwd"
                >
                  <el-input
                    v-model={elForms.ddcPwd}
                    size="large"
                    maxlength="20"
                    autocomplete="new-password"
                    type="password"
                  />
                </el-form-item>
                <el-form-item
                  class="create-form-input bsn-mt-30"
                  label={extension.i18n("DDC_Box_1010")}
                  prop="ddcPwdRe"
                >
                  <el-input
                    v-model={elForms.ddcPwdRe}
                    size="large"
                    maxlength="20"
                    autocomplete="new-password"
                    type="password"
                  />
                </el-form-item>
                <el-form-item
                  class="create-form-input bsn-mt-30"
                  prop="ddcTerms"
                >
                  <div style="display: flex">
                    <div>
                      <el-checkbox
                        v-model={elForms.ddcTerms}
                        class="create-form-checkbox"
                        label={extension.i18n("DDC_Box_1011")}
                        size="large"
                      />
                    </div>
                    <div class="bsn-pt-6">
                      <span
                        onClick={() => {
                          extension.platform.tabs.create(
                            {
                              url: "https://bsnbase.com/p/main/agreement",
                            },
                            () => {}
                          );
                        }}
                        class="bsn-ml-4 bsn-c-blue ucp bsn-f-18"
                      >
                        {extension.i18n("DDC_Box_1012")}
                      </span>
                    </div>
                  </div>
                </el-form-item>
              </el-form>
              <el-button
                type="primary"
                class="bsn-w-316 bsn-h-70  bsn-f-18 act-main bsn-mt-20  bsn-ml-20"
                onClick={() => submitForm("save")}
              >
                {dataInfo.stepNode == 20
                  ? extension.i18n("DDC_Box_0009")
                  : extension.i18n("DDC_Box_0009_1")}
              </el-button>
              <div
                v-show={dataInfo.stepNode != 22}
                class="bsn-mt-40  bsn-ml-20 bsn-c-gray bsn-f-18"
              >
                <div>
                  <span class="ihints">×</span>
                  <span class="bsn-ml-4">{extension.i18n("DDC_Box_1014")}</span>
                </div>
                <div class="bsn-mt-10">
                  <span class="ihints">×</span>
                  <span class="bsn-ml-4">{extension.i18n("DDC_Box_1015")}</span>
                </div>
                <div class="bsn-mt-10">
                  <span class="ihints">×</span>
                  <span class="bsn-ml-4">{extension.i18n("DDC_Box_1016")}</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
        <div class="bsn-h-40"></div>
      </>
    );
  },
});
