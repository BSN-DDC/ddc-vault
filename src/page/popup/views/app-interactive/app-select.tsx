/*
 * @Author: W·S
 * @Date: 2022-04-18 14:03:26
 * @LastEditors: W·S
 * @LastEditTime: 2022-04-27 19:47:01
 * @FilePath: /ddcvault/src/page/popup/views/app-interactive/app-select.tsx
 * @Description:
 */
import { defineComponent, ref, getCurrentInstance } from "vue";
import { ExtensionPlatform } from "@/utils/platforms/extension";
import {
  removeDDCAddAccount,
  getDDCAddAccount,
  DDCSDB,
} from "@/utils/platforms/cryptography";
export default defineComponent({
  setup() {
    const ddcsdb = new DDCSDB();
    const extension = new ExtensionPlatform();
    extension.removeLocal("ddcAddAccount");
    const ddcChainsList: any = ref([]);
    const elRadio = ref("0");
    const ddcSCA = getDDCAddAccount();

    const getDdcAcc = async () => {
      ddcChainsList.value = await ddcsdb.getDdcAcc();
      elRadio.value = ddcChainsList.value[0].account;
      if (ddcSCA.data.chainAccount)
        for (let index = 0; index < ddcChainsList.value.length; index++) {
          const element = ddcChainsList.value[index];
          if (element.account === ddcSCA.data.chainAccount) {
            return (elRadio.value = ddcSCA.data.chainAccount);
          }
        }
    };
    getDdcAcc();

    const onCancel = () => {
      extension.platform.windows.getCurrent((red: any) => {
        removeDDCAddAccount();
        extension.platform.windows.remove(red.id);
      });
    };

    const onConfirm = () => {
      extension.platform.tabs.sendMessage(
        ddcSCA.tabId,
        {
          cmd: "accountData",
          accountData: elRadio.value,
        },
        () => {
          extension.platform.windows.getCurrent((red: any) => {
            removeDDCAddAccount();
            extension.platform.windows.remove(red.id);
          });
        }
      );
    };
    return () => (
      <div class="bsn-box bsn-box-f1 bsn-box-ver">
        <div class="bsn-mt-20 bsn-mb-20 bsn-pl-20 bsn-pr-20 bsn-pt-16 bsn-pb-16">
          <div class="BSN-f-20">{extension.i18n("DDC_Box_2032")}</div>
          <ul>
            {ddcChainsList.value.map((item: any) => (
              <li
                class="bsn-f-16 icard bsn-mt-16 bsn-pt-10 bsn-pb-10 bsn-pl-18 bsn-pr-18 bsn-usp"
                style="box-sizing: border-box;"
              >
                <el-radio
                  class="bsn-w-100p"
                  v-model={elRadio.value}
                  name="elRadio"
                  label={item.account}
                  size="large"
                >
                  <p>{item.account}</p>
                </el-radio>
              </li>
            ))}
          </ul>
          <div class="bsn-ta-center bsn-mt-18">
            <el-button
              type="primary"
              onClick={onConfirm}
              class="bsn-w-90p bsn-maxw-400 bsn-h-44 bsn-f-16 act-main"
            >
              {extension.i18n("DDC_Box_0004_1")}
            </el-button>
          </div>
          <div class="bsn-ta-center bsn-mt-18">
            <el-button
              onClick={onCancel}
              class="bsn-w-90p bsn-maxw-400 bsn-h-44 bsn-f-16"
            >
              {extension.i18n("DDC_Box_0004")}
            </el-button>
          </div>
        </div>
      </div>
    );
  },
});
