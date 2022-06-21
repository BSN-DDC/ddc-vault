/*
 * @Author: Feix
 * @Date: 2022-03-07 15:54:45
 * @LastEditors: Feix
 * @LastEditTime: 2022-04-20 17:48:46
 * @Description: Mnemonic
 */
import { defineComponent, onMounted, reactive, ref } from "vue";
import { i18n, downloadFile } from "@/utils/tools";
import { MnemonicAll } from "@/utils/algorithm/mnemonicAll";
import { DDCSDB } from "@/utils/platforms/cryptography";
import { initAccounts } from "@/utils/accounts";
import { useMixin } from "@/mixin";
export default defineComponent({
  name: "MnemonicBox",
  setup() {
    interface DataInfoType {
      iMnemonic: string;
      showMnemonic: boolean;
    }

    const { Route } = useMixin();
    const iMnemonicAll = new MnemonicAll();
    const ddcsdb = new DDCSDB();

    onMounted(async () => {
      await createMnemonic();
    });

    const createMnemonic = async () => {
      const iHash = Route.query.iHash;
      dataInfo.iMnemonic = iMnemonicAll.getMnemonic();
      await initAccounts(dataInfo.iMnemonic, iHash);
    };

    const dataInfo: DataInfoType = reactive({
      iMnemonic: "",
      showMnemonic: false,
    });

    const setShowMnemonic = async () => {
      dataInfo.showMnemonic = true;
    };

    // Prevent connecting dots
    const clicktag = ref(0);

    const submitForm = (el: string) => {
      if (clicktag.value == 0) {
        clicktag.value = 1;
        setTimeout(() => {
          clicktag.value = 0;
        }, 1000);
      } else {
        return;
      }
      if (el == "rep") {
        if (dataInfo.showMnemonic) {
          createMnemonic();
        }
      } else if (el == "next") {
        // next
        window.open(chrome.runtime.getURL("popup.html"), "_top");
      }
    };

    // Download mnemonic
    const mnemonicDownload = async () => {
      downloadFile({ val: dataInfo.iMnemonic, type: "txt" });
    };

    return () => (
      <>
        <div class="bsn-h-40"></div>
        <el-card shadow="never" class="bsn-ml-130 bsn-mr-130 ">
          <el-row>
            <el-col class="bsn-f-22" span={12} align="left">
              <div class="bsn-mt-20 bsn-f-36"> {i18n("DDC_Box_1017")}</div>
              <el-row class="bsn-ml-20 bsn-mr-14">
                <el-col span={24} class="bsn-mt-50 ">
                  {i18n("DDC_Box_1018")}
                </el-col>
                <el-col span={24} class="bsn-mt-50">
                  {i18n("DDC_Box_1019")}
                </el-col>
                <el-col
                  v-show={dataInfo.showMnemonic}
                  span={24}
                  align="center"
                  class="bsn-mt-50 icard bsn-h-200"
                >
                  <p class="bsn-f-24">{dataInfo.iMnemonic}</p>
                </el-col>
                <el-col
                  v-show={!dataInfo.showMnemonic}
                  span={24}
                  align="center"
                  class="bsn-mt-50 bsn-h-200 ucp"
                  onClick={() => setShowMnemonic()}
                >
                  <el-row class="bsn-img-pwd">
                    <el-col span={24} class="bsn-mt-40">
                      <div class="bsn-w-44 bsn-h-56 bsn-img-lock"></div>
                    </el-col>
                    <el-col span={24}>
                      <span class="bsn-f-24 bsn-c-white ">
                        {i18n("DDC_Box_1020")}
                      </span>
                    </el-col>
                  </el-row>
                </el-col>

                <el-col span={24} align="center" class="bsn-mt-30 bsn-mb-50">
                  <el-row>
                    <el-col span={12} align="center">
                      <el-button
                        class="bsn-w-80p bsn-h-70 bsn-f-18 act-but"
                        onClick={() => submitForm("rep")}
                      >
                        {i18n("DDC_Box_1041")}
                      </el-button>
                    </el-col>
                    <el-col span={12} align="center">
                      <el-button
                        type="primary"
                        class="bsn-w-80p bsn-h-70 bsn-f-18 act-main"
                        onClick={() => submitForm("next")}
                      >
                        {i18n("DDC_Box_0006")}
                      </el-button>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
            <el-col class="bsn-f-20" span={10} align="left">
              <el-row class="bsn-ml-100 bsn-c-gray">
                <el-col span={24} class="bsn-mt-30">
                  {i18n("DDC_Box_1023")}:
                </el-col>
                <el-col span={24} class="bsn-mt-30">
                  {i18n("DDC_Box_1024")}
                </el-col>
                <el-col span={24} class="bsn-mt-30">
                  {i18n("DDC_Box_1025")}
                </el-col>
                <el-col span={24} class="bsn-mt-30">
                  {i18n("DDC_Box_1026")}
                </el-col>
                <el-col
                  span={24}
                  class="bsn-mt-30 bsn-c-blue ucp"
                  onClick={() => mnemonicDownload()}
                >
                  {i18n("DDC_Box_1027")}
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
      </>
    );
  },
});
