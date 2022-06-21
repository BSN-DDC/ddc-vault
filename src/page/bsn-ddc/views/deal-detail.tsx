/*
 * @Author: Yu Mengxin
 * @Date: 2022-03-22 10:30:00
 * @LastEditors: W·S
 * @LastEditTime: 2022-04-29 16:46:24
 * @FilePath: /ddcvault/src/page/bsn-ddc/views/deal-detail.tsx
 * @Description:
 *
 */
import { defineComponent, onMounted, reactive } from "vue";
import { ExtensionPlatform } from "@/utils/platforms/extension";
import { getTransferBlockInfo } from "@/api/DDCQuery";
import { useMixin } from "@/mixin";
const extension = new ExtensionPlatform();
export default defineComponent({
  setup() {
    const { Router, Route } = useMixin();
    const routerBack = (num = -1) => Router.go(num);
    const _ddcTransferId = Route.query.ddcTransferId;
    const opcChainName = Route.query.opcChainName;
    onMounted(() => {
      getDetail();
    });
    const dataInfo = reactive({
      detail: {} as any,
    });
    const detailList = reactive([
      {
        name: extension.i18n("DDC_Box_3012"),
        value: () => {
          return dataInfo.detail.tradeHash;
        },
      },
      {
        name: extension.i18n("DDC_Box_3018"),
        value: () => {
          return dataInfo.detail.blockHeight;
        },
      },
      {
        name: extension.i18n("DDC_Box_3019"),
        value: () => {
          return dataInfo.detail.blockHash;
        },
      },
      {
        name: extension.i18n("DDC_Box_3015"),
        value: () => {
          return dataInfo.detail.fromOptChainClientAddress || "--";
        },
      },
      {
        name: extension.i18n("DDC_Box_3016"),
        value: () => {
          return dataInfo.detail.toOptChainClientAddress || "--";
        },
      },
      {
        name: extension.i18n("DDC_Box_3003"),
        value: () => {
          return opcChainName || "--";
        },
      },
      {
        name: extension.i18n("DDC_Box_3007"),
        value: () => {
          return dataInfo.detail.tradeTime;
        },
      },
      {
        name: extension.i18n("DDC_Box_3020"),
        value: () => {
          switch (dataInfo.detail.tradeState) {
            case 1:
              return extension.i18n("DDC_Box_0011");
            case 2:
              return extension.i18n("DDC_Box_0012");
            default:
              return "--";
          }
        },
      },
    ]);
    //获取详情数据
    const getDetail = async () => {
      const params: any = {
        ddcTransferId: _ddcTransferId,
      };
      const res: any = await getTransferBlockInfo(params);
      if (res.code != 0) return;
      dataInfo.detail = res.data || {};
    };
    return () => (
      <div class="bsn-box bsn-box-f1 bsn-box-ver">
        <div class="bsn-detail-card bsn-ml-128 bsn-mr-128 bsn-mt-36 bsn-mb-36 bsn-pl-24 bsn-pr-24 bsn-pt-26 bsn-pb-26">
          <div class="card-head bsn-f-22 bsn-f-wb">
            <p>{extension.i18n("DDC_Box_3021")}</p>
          </div>
          <div class="card-content bsn-f-18 bsn-pt-20">
            <div>
              {detailList.map((item) => {
                return (
                  <el-row class="bsn-mb-36">
                    <el-col class="fc-86" span={8}>
                      {item.name}
                    </el-col>
                    <el-col span={16}>{item.value()}</el-col>
                  </el-row>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
