/*
 * @Author: W·S
 * @Date: 2022-04-18 11:22:46
 * @LastEditors: W·S
 * @LastEditTime: 2022-06-07 13:26:24
 * @FilePath: /ddcvault/src/page/popup/views/app-interactive/app-sign.tsx
 * @Description:
 */
import { defineComponent, ref, getCurrentInstance } from "vue";
import { ExtensionPlatform } from "@/utils/platforms/extension";
import { CHAINSID_TA, CHAINSID_WC, CHAINSID_WH } from "@/config";
import { K1 } from "@/utils/secp256k1";
import CustomUtil from "../../components/CustomUtil";
import {
  removeDDCSign,
  getDDCSign,
  DDCSDB,
} from "@/utils/platforms/cryptography";

export default defineComponent({
  setup() {
    const ElMessageBox =
      getCurrentInstance()?.appContext.config.globalProperties.ElMessageBox;
    const ddcsdb = new DDCSDB();
    const extension = new ExtensionPlatform();
    extension.removeLocal("ddcSign");
    const ddcChain: any = ref(null);
    const ddcUSD = getDDCSign();

    const getChainAccount = async () => {
      const chainAccounts = await ddcsdb.getDdcAcc();
      for (let index = 0; index < chainAccounts.length; index++) {
        if (chainAccounts[index].account === ddcUSD.data.chainAccount) {
          ddcChain.value = chainAccounts[index];
          return;
        }
      }
    };
    getChainAccount();

    const onCancel = () => {
      extension.platform.windows.getCurrent((red: any) => {
        removeDDCSign();
        extension.platform.windows.remove(red.id);
      });
    };

    const onConfirm = () => {
      CustomUtil(ElMessageBox, (data: string) => {
        let signData: any = "";
        let notKeys = "";
        const ddcUSD_signData: any = JSON.parse(ddcUSD.data.signData);
        // Calibration parameters
        if (
          ddcUSD.data.chainFrame + "" === CHAINSID_WH ||
          ddcUSD.data.chainFrame + "" === CHAINSID_WC
        ) {
          const keys = ["data", "nonce", "gasPrice", "gasLimit", "to", "value"];
          for (let index = 0; index < keys.length; index++) {
            if (
              Object.prototype.hasOwnProperty.call(ddcUSD_signData, keys[index])
            )
              ddcUSD_signData[keys[index]] = ddcUSD_signData[keys[index]];
            else notKeys += keys[index] + ", ";
          }
        } else {
          const keys = [
            "data",
            "extraData",
            "to",
            "blockLimit",
            "fiscoChainId",
            "gasLimit",
            "gasPrice",
            "groupId",
            "value",
          ];
          for (let index = 0; index < keys.length; index++) {
            if (
              Object.prototype.hasOwnProperty.call(ddcUSD_signData, keys[index])
            )
              ddcUSD_signData[keys[index]] = ddcUSD_signData[keys[index]];
            else notKeys += keys[index] + ", ";
          }
          ddcUSD_signData.blockLimit = parseInt(ddcUSD_signData.blockLimit);
          ddcUSD_signData.fiscoChainId = parseInt(ddcUSD_signData.fiscoChainId);
          ddcUSD_signData.fiscoChainId = parseInt(ddcUSD_signData.fiscoChainId);
          ddcUSD_signData.chainId = parseInt(ddcUSD_signData.fiscoChainId);
          ddcUSD_signData.gasLimit = parseInt(ddcUSD_signData.gasLimit);
          ddcUSD_signData.gasPrice = parseInt(ddcUSD_signData.gasPrice);
          ddcUSD_signData.groupId = parseInt(ddcUSD_signData.groupId);
          ddcUSD_signData.value = parseInt(ddcUSD_signData.value);
        }
        const k1 = new K1(ddcUSD_signData, ddcChain.value.privatekey);

        if (ddcUSD.data.chainFrame + "" === CHAINSID_WH && !notKeys)
          signData = k1.signWH(data);
        else if (ddcUSD.data.chainFrame + "" === CHAINSID_WC && !notKeys)
          signData = k1.signWC(data);
        else if (ddcUSD.data.chainFrame + "" === CHAINSID_TA && !notKeys)
          signData = k1.signTA(data);

        extension.platform.tabs.sendMessage(
          ddcUSD.tabId,
          {
            cmd: "signData",
            signData: notKeys
              ? JSON.stringify({
                  code: 1,
                  data: extension
                    .i18n("DDC_Box_5001")
                    .replace("A1", notKeys.substring(0, notKeys.length - 2)),
                })
              : JSON.stringify(signData),
          },
          () => {
            extension.platform.windows.getCurrent((red: any) => {
              removeDDCSign();
              extension.platform.windows.remove(red.id);
            });
          }
        );
      });
    };

    return () => (
      <div class="bsn-box bsn-box-f1 bsn-box-ver">
        <div class="bsn-h-162  bsn-bc-card bsn-w-302 bsn-mt-16 bsn-mb-16 bsn-pl-16 bsn-pr-16 bsn-pt-16 bsn-pb-16">
          <div class="bsn-box bsn-box-ac bsn-box-pc">
            <el-image
              fit="contain"
              src="/assets/images/wallet.png"
              class="bsn-h-58"
            ></el-image>
          </div>
          {ddcChain.value ? (
            <>
              <p class="bsn-box bsn-f-12 bsn-f-wb bsn-mt-20 bsn-c-white">
                {extension
                  .i18n("DDC_Box_2026")
                  .replace("AA", ddcUSD.data.websiteName)
                  .replace("BB", ddcUSD.data.chainAccount)}
              </p>
              <p class="bsn-ta-right bsn-f-12 bsn-f-wb bsn-c-white">
                <el-button class="bsn-w-72 bsn-h-27" onClick={onConfirm}>
                  {extension.i18n("DDC_Box_2027")}
                </el-button>
                <el-button
                  type="primary"
                  text="text"
                  class="fc-f"
                  onClick={onCancel}
                >
                  {extension.i18n("DDC_Box_0004")}
                </el-button>
              </p>
            </>
          ) : (
            <>
              <p class="bsn-box bsn-f-12 bsn-f-wb bsn-mt-20 bsn-c-white">
                {extension
                  .i18n("DDC_Box_2033")
                  .replace("AA", ddcUSD.data.chainAccount)}
              </p>
              <p class="bsn-ta-right bsn-f-12 bsn-f-wb">
                <el-button class="bsn-w-72 bsn-h-27" onClick={onCancel}>
                  {extension.i18n("DDC_Box_0004_1")}
                </el-button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  },
});
