/*
 * @Author: W·S
 * @Date: 2022-04-25 14:27:07
 * @LastEditors: W·S
 * @LastEditTime: 2022-05-30 16:17:13
 * @FilePath: /ddcvault/src/page/popup/views/app-interactive/app-home-dialog.tsx
 * @Description:
 */
import type { AccountInformation } from "@/inter";
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { ExtensionPlatform } from "@/utils/platforms/extension";
import { DDCSDB } from "@/utils/platforms/cryptography";
import { isEmpty, throttle } from "@/utils/tools";
import Clipboard from "clipboard";
import { deCrypt, _sha256 } from "@/utils/platforms/crypto";
import { ACTIONSTYPE, APPACCOUNTS } from "@/config";
import { K1 } from "@/utils/secp256k1";

interface ElFormsFace {
  checkP: string;
  type: string;
  account: string;
  signData: string;
  signDataEnd: string;
  password: string;
  privatekey: string;
  accountName: string;
  remark: string;
}

const extension = new ExtensionPlatform();
const ddcdb = new DDCSDB();

export default defineComponent({
  props: {
    init: { type: Function, required: true },
    dialogProp: {
      type: Object,
      required: true,
      default: () => {
        return { type: "", account: "", privatekey: "" };
      },
    },
  },
  setup(props) {
    let copyBtn;
    const showDialog = ref(false);
    let ddcInfoList: Array<AccountInformation> = [];
    ddcdb.getDdcAcc().then((_data) => {
      ddcInfoList = _data;
      elForms.accountName = "Account_" + _data.length;
    });
    ddcdb.storageChanged((_changes: any, _namespace: any) => {
      for (let [key] of Object.entries(_changes)) {
        if (key === APPACCOUNTS) {
          ddcdb.getDdcAcc().then((_data) => {
            ddcInfoList = _data;
            elForms.accountName = "Account_" + _data.length;
          });
          return;
        } else continue;
      }
    });
    onMounted(() => {
      props.init(showDialog);
      copyBtn = new Clipboard("#icopy");
      copyBtn.on("success", (e: any) => {
        extension.message(extension.i18n("DDC_Box_2029"));
        e.clearSelection();
      });
      copyBtn.on("error", () => {
        console.error("error");
      });
    });
    const refElForms: any = ref(null);
    const elForms: ElFormsFace = reactive({
      checkP: "false",
      type: props.dialogProp.type,
      account: props.dialogProp.account,
      signData: "",
      signDataEnd: "",
      password: "",
      privatekey: "",
      accountName: "",
      remark: "",
    });
    const elValidator = async (rule: any, value: any, callback: Function) => {
      let _boolean = false;
      switch (rule.field) {
        case "signData":
          if (isEmpty(value))
            return callback(
              new Error(
                extension
                  .i18n("DDC_Box_0010")
                  .replace("****", extension.i18n("DDC_Box_2046"))
              )
            );
          break;
        case "accountName":
          if (isEmpty(value))
            return callback(
              new Error(
                extension
                  .i18n("DDC_Box_0010")
                  .replace("****", extension.i18n("DDC_Box_2040"))
              )
            );
          if (elForms.checkP === "true") {
            elForms.checkP = "false";
            for (let index = 0; index < ddcInfoList.length; index++) {
              if (
                ddcInfoList[index].account !== elForms.account &&
                ddcInfoList[index].name === value
              ) {
                return callback(new Error(extension.i18n("DDC_Box_2034")));
              }
            }
          }
          break;
        case "password":
          if (isEmpty(value))
            return callback(new Error(extension.i18n("DDC_Box_1030_1")));
          if (value.length < 8)
            return callback(new Error(extension.i18n("DDC_Box_1009_2")));
          if (elForms.checkP === "true") {
            elForms.checkP = "false";
            _boolean = await ddcdb.checkPassW(value);
            if (!_boolean)
              return callback(new Error(extension.i18n("DDC_Box_1037")));
          }
          break;
        default:
          break;
      }
      callback();
    };
    const getElFormsRules = () => {
      switch (elForms.type) {
        case ACTIONSTYPE.toSign:
          return {
            signData: {
              required: true,
              validator: elValidator,
              trigger: "change",
            },
            password: {
              required: true,
              validator: elValidator,
              trigger: "change",
            },
          };
        case ACTIONSTYPE.showKey:
          return {
            password: {
              required: true,
              validator: elValidator,
              trigger: "change",
            },
          };
        case ACTIONSTYPE.edit:
          return {
            accountName: {
              required: true,
              validator: elValidator,
              trigger: "change",
            },
          };
      }
      return {};
    };
    watch(
      () => showDialog,
      () => {
        elForms.type = props.dialogProp.type;
        elForms.account = props.dialogProp.account;
        elForms.accountName = props.dialogProp.name;
        elForms.remark = props.dialogProp.remark;
        elForms.signDataEnd = "";
        elForms.privatekey = "";
      },
      { deep: true }
    );
    const onConfirm = throttle(async () => {
      elForms.checkP = "true";
      refElForms.value.validate(async (valid: boolean) => {
        if (valid) {
          let k1, data, _data;
          switch (elForms.type) {
            case ACTIONSTYPE.toSign:
              k1 = new K1(elForms.signData, props.dialogProp.privatekey);
              data = await k1.sign(elForms.password);
              elForms.signDataEnd = data.toString();
              break;
            case ACTIONSTYPE.showKey:
              elForms.privatekey = deCrypt(
                props.dialogProp.privatekey,
                _sha256(elForms.password)
              );
              break;
            case ACTIONSTYPE.edit:
              _data = await ddcdb.getDdcAcc();
              for (let index = 0; index < _data.length; index++) {
                if (_data[index].account === elForms.account) {
                  _data[index].name = elForms.accountName;
                  _data[index].remark = elForms.remark;
                }
              }
              await ddcdb.setDdcAcc(_data);
              refElForms.value.resetFields();
              showDialog.value = false;
          }
        }
      });
    }, 1000);

    return () => (
      <div>
        <div
          id="icopy"
          class="bsn-w-0 bsn-h-0 icopy"
          data-clipboard-text={
            elForms.signDataEnd
              ? elForms.signDataEnd
              : elForms.privatekey
              ? elForms.privatekey
              : ""
          }
        ></div>
        <el-dialog
          vModel={showDialog.value}
          destroyOnClose={true}
          closeOnPressEscape={false}
          closeOnClickModal={false}
          beforeClose={(done: Function) => {
            refElForms.value.resetFields();
            done();
          }}
          title={extension.i18n(props.dialogProp.title)}
          custom-class="bsn-w-700"
        >
          {{
            default: () => {
              return (
                <el-form
                  ref={refElForms}
                  model={elForms}
                  rules={getElFormsRules()}
                  class="bsn-w-80p"
                  labelWidth="8rem"
                >
                  <el-form-item label={extension.i18n("DDC_Box_3033")}>
                    <span>{elForms.account}</span>
                  </el-form-item>

                  {elForms.type === ACTIONSTYPE.toSign ||
                  elForms.type === ACTIONSTYPE.showKey ? (
                    <>
                      {elForms.type === ACTIONSTYPE.toSign ? (
                        <el-form-item
                          label={extension.i18n("DDC_Box_2047") + ":"}
                          prop="signData"
                        >
                          <el-input
                            vModel={elForms.signData}
                            onInput={() => {
                              elForms.signDataEnd = "";
                            }}
                            rows="4"
                            type="textarea"
                            placeholder={extension.i18n("DDC_Box_2049")}
                          />
                        </el-form-item>
                      ) : null}
                      <el-form-item
                        label={extension.i18n("DDC_Box_2048") + ":"}
                        prop="password"
                      >
                        <el-input
                          vModel={elForms.password}
                          maxlength="20"
                          type="password"
                          placeholder={extension.i18n("DDC_Box_1030_1")}
                        />
                      </el-form-item>
                    </>
                  ) : elForms.type === ACTIONSTYPE.edit ? (
                    <>
                      <el-form-item
                        label={extension.i18n("DDC_Box_2040") + ":"}
                        prop="accountName"
                      >
                        <el-input
                          vModel={elForms.accountName}
                          maxlength="20"
                          type="text"
                          placeholder={extension
                            .i18n("DDC_Box_0010")
                            .replace("****", extension.i18n("DDC_Box_2040"))}
                        />
                      </el-form-item>
                      <el-form-item
                        label={extension.i18n("DDC_Box_2044") + ":"}
                        prop="remark"
                      >
                        <el-input
                          vModel={elForms.remark}
                          maxlength="50"
                          rows="2"
                          type="textarea"
                          placeholder={extension
                            .i18n("DDC_Box_0010")
                            .replace("****", extension.i18n("DDC_Box_2044"))}
                        />
                      </el-form-item>
                    </>
                  ) : null}

                  {elForms.signDataEnd ? (
                    <el-form-item
                      label={extension.i18n("DDC_Box_2050") + ":"}
                      prop="signDataEnd"
                    >
                      <el-input
                        vModel={elForms.signDataEnd}
                        rows="4"
                        type="textarea"
                      />
                    </el-form-item>
                  ) : elForms.privatekey ? (
                    <el-form-item
                      label={extension.i18n("DDC_Box_2051") + ":"}
                      prop="privatekey"
                    >
                      <el-input
                        vModel={elForms.privatekey}
                        rows="4"
                        type="textarea"
                      />
                    </el-form-item>
                  ) : (
                    <div></div>
                  )}
                </el-form>
              );
            },
            footer: () => {
              return (
                <div class="bsn-ta-center">
                  <el-button
                    class="bsn-w-150 bsn-h-40"
                    onClick={() => {
                      refElForms.value.resetFields();
                      showDialog.value = false;
                    }}
                  >
                    {extension.i18n("DDC_Box_0004")}
                  </el-button>
                  {elForms.signDataEnd || elForms.privatekey ? (
                    <el-button
                      class="bsn-w-150 bsn-h-40"
                      type="primary"
                      onClick={() => {
                        document.getElementById("icopy")?.click();
                      }}
                    >
                      {extension.i18n("DDC_Box_2052")}
                    </el-button>
                  ) : (
                    <el-button
                      class="bsn-w-150 bsn-h-40"
                      type="primary"
                      onClick={onConfirm}
                    >
                      {extension.i18n("DDC_Box_0004_1")}
                    </el-button>
                  )}
                </div>
              );
            },
          }}
        </el-dialog>
      </div>
    );
  },
});
