/*
 * @Author: W·S
 * @Date: 2022-04-25 14:27:07
 * @LastEditors: W·S
 * @LastEditTime: 2022-05-30 16:19:19
 * @FilePath: /ddcvault/src/components/CustomHeaderDialog.tsx
 * @Description:
 */

import type { AccountInformation } from "@/inter";
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { ExtensionPlatform } from "@/utils/platforms/extension";
import { DDCSDB } from "@/utils/platforms/cryptography";
import { isEmpty, throttle } from "@/utils/tools";
import Clipboard from "clipboard";
import { deCrypt, _sha256 } from "@/utils/platforms/crypto";
import { ACTIONSTYPE, APPACCOUNTS, SECPK1, UEALIST } from "@/config";
import { createAccounts, importAccounts } from "@/utils/accounts";
import { useMixin } from "@/mixin";

const extension = new ExtensionPlatform();
const ddcdb = new DDCSDB();

export default defineComponent({
  props: {
    init: { type: Function, required: true },
    dialogProp: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    let copyBtn;
    const showDialog = ref(false);
    const { Router } = useMixin();
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
      copyBtn = new Clipboard("#icopy199");
      copyBtn.on("success", (e: any) => {
        extension.message(extension.i18n("DDC_Box_2029"));
        e.clearSelection();
      });
      copyBtn.on("error", (error) => {
        console.error(error);
      });
    });
    const refElForms: any = ref(null);
    const elForms = reactive({
      checkP: "false",
      type: props.dialogProp.type,
      uea: SECPK1,
      account: "",
      password: "",
      privatekey: "",
      accountName: "",
      remark: "",
      copyData: "",
      mnemonic: "",
    });
    const elValidator = async (rule: any, value: any, callback: Function) => {
      switch (rule.field) {
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

          if (elForms.checkP == "true") {
            const boo = await ddcdb.checkPassW(value);
            console.log(boo);
            if (!boo)
              return callback(new Error(extension.i18n("DDC_Box_1037")));
          }
          break;
        case "privatekey":
          if (isEmpty(value))
            return callback(new Error(extension.i18n("DDC_Box_2016")));
          else if (
            elForms.checkP === "trues" ||
            elForms.checkP === "DDC_Box_2031"
          ) {
            if (elForms.checkP === "DDC_Box_2031")
              return callback(new Error(extension.i18n("DDC_Box_2031")));
            for (let index = 0; index < ddcInfoList.length; index++) {
              if (ddcInfoList[index].account === elForms.account) {
                return callback(new Error(extension.i18n("DDC_Box_2035")));
              }
            }
          }
          break;
        default:
          break;
      }
      callback();
    };
    const getElFormsRules = () => {
      switch (elForms.type) {
        case ACTIONSTYPE.createAccount:
          return {
            accountName: {
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
        case ACTIONSTYPE.importAccount:
          return {
            accountName: {
              required: true,
              validator: elValidator,
              trigger: "change",
            },
            password: {
              required: true,
              validator: elValidator,
              trigger: "change",
            },
            privatekey: {
              required: true,
              validator: elValidator,
              trigger: "change",
            },
          };
        case ACTIONSTYPE.showMnemonic:
          return {
            password: {
              required: true,
              validator: elValidator,
              trigger: "change",
            },
          };
          break;
        default:
          break;
      }
      return {};
    };
    watch(
      () => showDialog,
      () => {
        elForms.type = props.dialogProp.type;
        elForms.account = "";
        elForms.remark = "";
        elForms.privatekey = "";
        elForms.mnemonic = "";
        elForms.copyData = "";
      },
      { deep: true }
    );

    const onConfirm = throttle(async () => {
      elForms.checkP = "true";
      refElForms.value.validate(async (valid: boolean) => {
        elForms.checkP = "false";
        if (valid) {
          const hash = _sha256(elForms.password as string);
          let createIndex = 0,
            moe,
            param,
            param1: any,
            mnemo;
          switch (elForms.type) {
            case ACTIONSTYPE.createAccount:
              ddcInfoList.map((_item: any) => {
                if (_item.type === "create" && _item.uea === elForms.uea) {
                  createIndex++;
                }
              });
              moe = await ddcdb.getDdcMne();
              param = createAccounts({
                accountName: elForms.accountName,
                mnemonic: deCrypt(moe, hash),
                hash,
                index: createIndex,
                uea: elForms.uea,
              });
              param.remark = elForms.remark;
              ddcInfoList.push(param);
              await ddcdb.setDdcAcc(ddcInfoList);
              refElForms.value.resetFields();
              showDialog.value = false;
              break;
            case ACTIONSTYPE.importAccount:
              try {
                param1 = importAccounts({
                  accountName: elForms.accountName,
                  privatekey: elForms.privatekey,
                  hash,
                  uea: elForms.uea,
                });
                param1.remark = elForms.remark;
                elForms.account = param1.account;
                elForms.checkP = "trues";
                refElForms.value.validate(async (_valid: boolean) => {
                  if (_valid) {
                    ddcInfoList.push(param1);
                    await ddcdb.setDdcAcc(ddcInfoList);
                    refElForms.value.resetFields();
                    showDialog.value = false;
                  }
                });
              } catch (error) {
                elForms.checkP = "DDC_Box_2031";
                refElForms.value.validate();
              }
              break;
            case ACTIONSTYPE.showMnemonic:
              mnemo = await ddcdb.getDdcMne();
              elForms.mnemonic = deCrypt(mnemo, _sha256(elForms.password));
              elForms.copyData = elForms.mnemonic;
              break;
            default:
              break;
          }
        }
      });
    }, 1000);

    return () => (
      <div>
        <div
          id="icopy199"
          class="bsn-w-0 bsn-h-0 icopy199"
          data-clipboard-text={elForms.copyData}
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
                  {elForms.type !== ACTIONSTYPE.showMnemonic ? (
                    <>
                      <el-form-item label={extension.i18n("DDC_Box_2042")}>
                        <el-select
                          vModel={elForms.uea}
                          placeholder="please select your zone"
                        >
                          {UEALIST.map((_data) => {
                            return <el-option label={_data} value={_data} />;
                          })}
                        </el-select>
                      </el-form-item>
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
                  ) : (
                    <div class="bsn-pl-50">
                      <div class="bsn-c-gray bsn-f-14 bsn-lh-150p">
                        {extension.i18n("DDC_Box_2019")}
                      </div>
                      <div
                        class="bsn-box bsn-box-ac bsn-mt-20 bsn-mb-20 bsn-pl-10"
                        style="background: #FFF7F5;"
                      >
                        <div>
                          <div class="bsn-img-warn bsn-w-26 bsn-h-26"></div>
                        </div>
                        <div class="bsn-pl-30 bsn-pt-10 bsn-pb-10">
                          <div class="bsn-c-gray bsn-f-14 bsn-lh-150p">
                            {extension.i18n("DDC_Box_2020")}
                          </div>
                          <div class="bsn-c-gray bsn-f-14 bsn-lh-150p bsn-mt-10">
                            {extension.i18n("DDC_Box_2021")}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {elForms.type === ACTIONSTYPE.importAccount ? (
                    <el-form-item
                      label={extension.i18n("DDC_Box_2051") + ":"}
                      prop="privatekey"
                    >
                      <el-input
                        vModel={elForms.privatekey}
                        maxlength="200"
                        rows="2"
                        type="textarea"
                        placeholder={extension
                          .i18n("DDC_Box_0010")
                          .replace("****", extension.i18n("DDC_Box_2051"))}
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
                  {elForms.type === ACTIONSTYPE.showMnemonic &&
                  elForms.mnemonic ? (
                    <el-form-item
                      label={extension.i18n("DDC_Box_1017") + ":"}
                      prop="mnemonic"
                    >
                      <el-input
                        vModel={elForms.mnemonic}
                        rows="3"
                        type="textarea"
                      />
                    </el-form-item>
                  ) : null}
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

                  {elForms.copyData ? (
                    <el-button
                      class="bsn-w-150 bsn-h-40"
                      type="primary"
                      onClick={() => {
                        document.getElementById("icopy199")?.click();
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
