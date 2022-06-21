/*
 * @Author: W·S
 * @Date: 2022-04-25 16:27:04
 * @LastEditors: W·S
 * @LastEditTime: 2022-04-28 10:23:27
 * @FilePath: /ddcvault/src/components/CustomHeader.tsx
 * @Description:
 */

import type { Ref } from "vue";
import { defineComponent, ref, watch } from "vue";
import { ExtensionPlatform } from "@/utils/platforms/extension";
import { DDCSDB } from "@/utils/platforms/cryptography";
import { useMixin } from "@/mixin";
import { ACTIONSTYPE } from "@/config";
import CustomHeaderDialog from "./CustomHeaderDialog";

const ddcsdb = new DDCSDB();
const extension = new ExtensionPlatform();

const DDCChainKeys = (visible: any, callBack: Function) => {
  const { Router } = useMixin();
  const onCommand = (_item: any) => {};
  const onVisibleChange = (_bol: boolean) => (visible.value = _bol);
  const locking = () => {
    ddcsdb.setDdcSta("0").then(() => {
      Router.push({ name: "AppIndex" });
    });
  };
  return () => (
    <el-dropdown
      onCommand={onCommand}
      onVisibleChange={onVisibleChange}
      trigger="click"
    >
      {{
        default: () => (
          <div class="bsn-box bsn-ddc-accounts bsn-f-14 bsn-h-62 bsn-f-wb bsn-usp">
            <div class="bsn-box bsn-box-ac bsn-box-pc bsn-mr-10 bsn-ml-26">
              <el-avatar
                class="bsn-w-50 bsn-h-50"
                fit="contain"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              />
            </div>
            <div
              class="bsn-box bsn-box-ac bsn-box-pc bsn-w-20"
              style="background: #3A5491;border-radius: 2px;"
            >
              {!visible.value ? (
                <el-icon color="white">
                  <arrow-down />
                </el-icon>
              ) : (
                <el-icon color="white">
                  <arrow-up />
                </el-icon>
              )}
            </div>
          </div>
        ),
        dropdown: () => {
          return (
            <>
              <el-dropdown-menu class="bsn-w-260">
                <el-scrollbar>
                  <li class="el-dropdown-menu__item bsn-box bsn-box-pj bsn-box-ac bsn-pl-10 bsn-pr-30 bsn-pt-20 bsn-pb-20 bsn-border-bottom">
                    <div class="bsn-f-16 bsn-f-wb el-dropdown-menu__item">
                      {extension.i18n("DDC_Box_2011")}
                    </div>
                    <el-button
                      class="bsn-f-14 bsn-f-wb"
                      type="primary"
                      onClick={locking}
                      round
                    >
                      {extension.i18n("DDC_Box_2012")}
                    </el-button>
                  </li>
                  <li class="el-dropdown-menu__item bsn-box bsn-box-pj bsn-box-ac bsn-pl-10 bsn-pr-30 bsn-pt-20 bsn-pb-20 bsn-border-bottom">
                    <el-button
                      class="bsn-f-16 bsn-f-wb el-dropdown-menu__item"
                      onClick={() => {
                        callBack(ACTIONSTYPE.createAccount, "DDC_Box_2002");
                      }}
                      type="primary"
                      text="text"
                    >
                      <el-icon>
                        <plus />
                      </el-icon>
                      {extension.i18n("DDC_Box_2002")}
                    </el-button>
                  </li>
                  <li class="el-dropdown-menu__item bsn-box bsn-box-pj bsn-box-ac bsn-pl-10 bsn-pr-30 bsn-pt-20 bsn-pb-20 bsn-border-bottom">
                    <el-button
                      class="bsn-f-16 bsn-f-wb el-dropdown-menu__item"
                      onClick={() => {
                        callBack(ACTIONSTYPE.importAccount, "DDC_Box_2003");
                      }}
                      type="primary"
                      text="text"
                    >
                      <el-icon>
                        <download />
                      </el-icon>
                      {extension.i18n("DDC_Box_2003")}
                    </el-button>
                  </li>
                  <li class="el-dropdown-menu__item bsn-box bsn-box-pj bsn-box-ac bsn-pl-10 bsn-pr-30 bsn-pt-20 bsn-pb-20">
                    <el-button
                      class="bsn-f-16 bsn-f-wb el-dropdown-menu__item"
                      onClick={() => {
                        callBack(ACTIONSTYPE.showMnemonic, "DDC_Box_2004");
                      }}
                      type="primary"
                      text="text"
                    >
                      <el-icon>
                        <sunny />
                      </el-icon>
                      {extension.i18n("DDC_Box_2004")}
                    </el-button>
                  </li>
                </el-scrollbar>
              </el-dropdown-menu>
            </>
          );
        },
      }}
    </el-dropdown>
  );
};

export default defineComponent({
  components: { CustomHeaderDialog },
  setup() {
    const { Route } = useMixin();
    const visible = ref(false);
    const ddcChainKeyOnClick = (_type: string, _title: string) => {
      refDialogProp.value.type = _type;
      refDialogProp.value.title = _title;
      refShowDialog.value.value = true;
    };
    const ddc_chain_keys = DDCChainKeys(visible, ddcChainKeyOnClick);
    const refShowDialog: any = ref(false);
    const refDialogProp = ref({
      type: "",
      title: "",
      account: "",
      privatekey: "",
      name: "",
      uea: "",
    });
    watch(
      () => Route.path,
      () => {
        visible.value = false;
      }
    );

    return () => (
      <div class="bsn-w-100p bsn-h-100p bsn-box-f1 bsn-box bsn-box-ver">
        <div
          class={
            "bsn-h-96 bsn-pl-18 bsn-pr-18 bsn-box bsn-box-ac bsn-box-pj bsn-bc-white " +
            (document.documentElement.clientWidth <= 400
              ? "bsn-pr-12 bsn-pl-12"
              : "bsn-pr-112 bsn-pl-112")
          }
        >
          <div>
            <el-image
              fit="contain"
              src="/assets/logo.png"
              class="bsn-h-30"
            ></el-image>
          </div>
          <div>{Route.meta.show1 ? <ddc_chain_keys /> : null}</div>
        </div>
        <div class="bsn-box bsn-box-f1 bsn-box-pc">
          <el-scrollbar class="bsn-w-100p">
            <router-view />
          </el-scrollbar>
        </div>
        <custom-header-dialog
          dialogProp={refDialogProp.value}
          init={(_val: any) => {
            refShowDialog.value = _val;
          }}
        ></custom-header-dialog>
      </div>
    );
  },
});
