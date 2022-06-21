/*
 * @Author: Feix
 * @Date: 2022-03-07 15:54:45
 * @LastEditors: Feix
 * @LastEditTime: 2022-04-19 18:01:08
 * @Description: Using the DDC box for the first time
 */

import { defineComponent } from "vue";
import { i18n } from "@/utils/tools";
import { useMixin } from "@/mixin";
export default defineComponent({
  name: "OneBox",
  setup() {
    interface DataInfoType {
      // 20:create, 21:import
      stepNode: number;
    }

    const { Router } = useMixin();
    const submitForm = (el: string) => {
      // Create chain account（default）
      const params: DataInfoType = { stepNode: 20 };
      // Import chain account
      if (el == "import") {
        params.stepNode = 21;
      }
      Router.push({ path: "create-pwd", query: params });
    };
    return () => (
      <el-row class="bsn-w-1200 bsn-mlr-auto">
        <el-col
          span={24}
          align="center"
          class="bsn-mb-60 bsn-f-36 bsn-mt-30 bsn-f-wb"
        >
          {i18n("DDC_Box_1001")}
        </el-col>
        <el-col span={12} align="right">
          <el-row class="bsn-mr-14 icard bsn-bc-white">
            <el-col
              span={24}
              align="center"
              class="bsn-mt-68 bsn-f-30 bsn-f-wb"
            >
              {i18n("DDC_Box_1002")}
            </el-col>
            <el-col
              span={24}
              align="center"
              class="bsn-mt-20 bsn-f-22 bsn-c-theme2 bsn-mb-30"
            >
              {i18n("DDC_Box_1003")}
            </el-col>
            <el-divider class="bsn-ml-16 bsn-mr-16"></el-divider>
            <el-col span={24} align="center" class="bsn-mt-30 bsn-mb-50">
              <el-button
                type="primary"
                class="bsn-w-176 bsn-h-70 bsn-f-18 act-main"
                onClick={() => submitForm("import")}
              >
                {i18n("DDC_Box_1004")}
              </el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col span={12} align="right">
          <el-row class="bsn-ml-14 icard bsn-bc-white">
            <el-col
              span={24}
              align="center"
              class="bsn-mt-68 bsn-f-30 bsn-f-wb"
            >
              {i18n("DDC_Box_1005")}
            </el-col>
            <el-col
              span={24}
              align="center"
              class="bsn-mt-20 bsn-f-22 bsn-c-theme2 bsn-mb-30"
            >
              {i18n("DDC_Box_1006")}
            </el-col>
            <el-divider class="bsn-ml-16 bsn-mr-16"></el-divider>
            <el-col span={24} align="center" class="bsn-mt-30 bsn-mb-50">
              <el-button
                type="primary"
                class="bsn-w-176 bsn-h-70 bsn-f-18 act-main"
                onClick={() => submitForm("create")}
              >
                {i18n("DDC_Box_1007")}
              </el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    );
  },
});
