/*
 * @Author: W·S
 * @Date: 2022-03-21 17:11:36
 * @LastEditors: W·S
 * @LastEditTime: 2022-04-20 18:09:31
 * @Description:
 */
import { defineComponent, ref, onMounted } from "vue";
import { ExtensionPlatform } from "@/utils/platforms/extension";
import Clipboard from "clipboard";
import { useMixin } from "@/mixin";

export default defineComponent({
  props: ["chainName", "chainKey"],
  setup(props) {
    const { Router } = useMixin();
    const extension = new ExtensionPlatform();
    let copyBtn;
    onMounted(() => {
      copyBtn = new Clipboard("#icopy");
      copyBtn.on("success", (e: any) => {
        extension.message(extension.i18n("DDC_Box_2029"));
        e.clearSelection();
      });
      copyBtn.on("error", () => {
        console.error("error");
      });
    });
    return () => (
      <div
        class="bsn-h-68 bsn-box bsn-box-ac bsn-f-14 bsn-c-white bsn-pl-18 bsn-pr-18"
        style="background: #312E2D;"
      >
        <div class="">
          <span>{/*extension.i18n("DDC_Box_0003")*/ "　　　　　"}</span>
        </div>
        <div class="bsn-box-f1 bsn-f-14 bsn-box bsn-box-ver bsn-box-ac bsn-box-pc">
          <div
            class="bsn-usp"
            onClick={() => {
              Router.push({
                name: "AppCreateAccount",
                query: {
                  stepNode: 32,
                  accountName: props.chainName || "--",
                },
              });
            }}
          >
            <span>{props.chainName}</span>
            <el-image
              fit="contain"
              src="/assets/images/edit.png"
              class="bsn-h-14 bsn-ml-4"
            ></el-image>
          </div>
          <div
            id="icopy"
            class="bsn-mt-4 bsn-usp icopy"
            data-clipboard-text={props.chainKey}
          >
            <span class="bsn-f-10 fc-f">
              {props.chainKey.length >= 10
                ? props.chainKey.substring(0, 5) +
                  "....." +
                  props.chainKey.substring(
                    props.chainKey.length - 5,
                    props.chainKey.length
                  )
                : props.chainKey}
            </span>
            <el-image
              fit="contain"
              src="/assets/images/copy.png"
              class="bsn-h-14 bsn-ml-4"
            ></el-image>
          </div>
        </div>
      </div>
    );
  },
});
