/*
 * @Author: Feix
 * @Date: 2022-03-08 10:28:38
 * @LastEditors: W·S
 * @LastEditTime: 2022-05-19 15:51:42
 * @Description: 引导页底层页面
 */

import { ExtensionPlatform } from "@/utils/platforms/extension";
import { utiles_setRem } from "@/utils/setRem";
import { defineComponent, onMounted, ref } from "vue";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import EN from "element-plus/lib/locale/lang/en";

export default defineComponent({
  name: "Home",
  setup() {
    const extension = new ExtensionPlatform();
    const locale: any = ref(EN);
    onMounted(() => {
      const language = chrome.i18n.getUILanguage();
      if (language.indexOf("zh-CN") >= 0) locale.value = zhCn;
      document.title = extension.i18n("DDC_Box_0001");
      utiles_setRem();
    });

    return () => (
      <div class="bsn-f-18 bsn-h-100p">
        <div class="bsn-ml-130 bsn-mr-130 bsn-pt-18 bsn-pb-18">
          <div class="bsn-w-194 bsn-h-60 bsn-img-ddc" />
        </div>
        <div class="bsn-bc-bg bsn-minh-main">
          <el-config-provider locale={locale.value}>
            <router-view></router-view>
          </el-config-provider>
        </div>
      </div>
    );
  },
});
