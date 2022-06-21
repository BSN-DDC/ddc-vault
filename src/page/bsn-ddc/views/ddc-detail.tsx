/*
 * @Author: Yu Mengxin
 * @Date: 2022-03-18 15:35:41
 * @LastEditors: W·S
 * @LastEditTime: 2022-05-19 15:47:02
 * @FilePath: /ddcvault/src/page/bsn-ddc/views/ddc-detail.tsx
 * @Description:
 *
 */
import { defineComponent, onMounted, reactive } from "vue";
import { ExtensionPlatform } from "@/utils/platforms/extension";
import {
  getDDCAccountAddress,
  getDDCDetail,
  getTransferList,
} from "@/api/DDCQuery";
import { useMixin } from "@/mixin";
import CustomPagination from "@/components/CustomPagination";

const extension = new ExtensionPlatform();
export default defineComponent({
  components: { CustomPagination },
  setup() {
    const { Router, Route } = useMixin();
    const routerBack = (num = -1) => Router.go(num);
    const _platformDdcId = Route.query.platformDdcId;
    const opcChainName = Route.query.opcChainName;
    onMounted(() => {
      currentChange(1);
      getDetail();
      TransferList(1);
    });
    const dataInfo = reactive({
      total: 0,
      pageNum: 0,
      pageIndex: 1,
      transferPageNum: 0,
      transferTotal: 0,
      transferPageIndex: 1,
      list: [] as any,
      transferList: [] as any,
      detail: {} as any,
    });
    const detailList = reactive([
      {
        name: extension.i18n("DDC_Box_3002"),
        value: () => {
          return dataInfo.detail.ddcId;
        },
      },
      {
        name: extension.i18n("DDC_Box_3003"),
        value: () => {
          return opcChainName || "--";
        },
      },
      {
        name: extension.i18n("DDC_Box_3004"),
        value: () => {
          return dataInfo.detail.ddcType == "721" ? "ERC-721" : "ERC-1155";
        },
      },
      {
        name: extension.i18n("DDC_Box_3005"),
        value: () => {
          return dataInfo.detail.ddcPubTotal;
        },
      },
      {
        name: extension.i18n("DDC_Box_3007"),
        value: () => {
          return dataInfo.detail.generateDate || "--";
        },
      },
      // {
      //   name: extension.i18n("DDC_Box_3008"),
      //   value: () => {
      //     return dataInfo.detail.ddcUri || "--";
      //   },
      // },
    ]);
    const currentChange = async (num: number) => {
      dataInfo.pageNum = num;
      const params: any = {
        page: {
          pageSize: 10,
          pageNum: dataInfo.pageNum,
        },
        data: {
          platformDdcId: _platformDdcId,
        },
      };
      const res: any = await getDDCAccountAddress(params);
      if (res.code != 0) return;
      dataInfo.list = res.data || [];
      dataInfo.total = res.resultPageInfo.total;
    };
    const getDetail = async () => {
      const params: any = {
        platformDdcId: _platformDdcId,
      };
      const res: any = await getDDCDetail(params);
      if (res.code != 0) return;
      dataInfo.detail = res.data || {};
    };
    const TransferList = async (num: number) => {
      dataInfo.transferPageNum = num;
      const params: any = {
        page: {
          pageSize: 10,
          pageNum: dataInfo.transferPageNum,
        },
        data: {
          platformDdcId: _platformDdcId,
        },
      };
      const res: any = await getTransferList(params);
      if (res.code != 0) return;
      dataInfo.transferList = res.data || [];
      dataInfo.transferTotal = res.resultPageInfo.total;
    };
    const formatterType = (value: any) => {
      switch (value.tradeType) {
        case 1:
          return extension.i18n("DDC_Box_3028");
        case 2:
          return extension.i18n("DDC_Box_3029");
        case 10:
          return extension.i18n("DDC_Box_3030");
        default:
          return "--";
      }
    };
    const onRowClick = (row: any) => {
      Router.push({
        name: "DealDetail",
        query: { ddcTransferId: row.ddcTransferId, opcChainName },
      });
    };
    return () => (
      <div class="bsn-box-f1">
        <div class="bsn-detail-card bsn-ml-128 bsn-mr-128 bsn-mt-36 bsn-pl-24 bsn-pr-24 bsn-pt-26 bsn-pb-26">
          <div class="card-head bsn-f-22 bsn-f-wb">
            <p>{extension.i18n("DDC_Box_3001")}</p>
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
              <el-row class="bsn-mb-36">
                <el-col class="fc-86" span={8}>
                  {extension.i18n("DDC_Box_3008")}
                </el-col>
                <el-col span={10}>
                  <el-image
                    src={dataInfo.detail.ddcUri}
                    alt={dataInfo.detail.ddcUri}
                    preview-src-list={[dataInfo.detail.ddcUri]}
                  >
                    {{
                      error: () => <span>{dataInfo.detail.ddcUri}</span>,
                    }}
                  </el-image>
                </el-col>
              </el-row>
            </div>
            <el-row class="bsn-mb-36">
              <el-col class="fc-86" span={8}>
                {extension.i18n("DDC_Box_3009")}
              </el-col>
              <el-col span={16}>
                <el-table
                  emptyText={extension.i18n("DDC_Box_3027")}
                  data={dataInfo.list}
                  stripe
                >
                  <el-table-column prop="ddcOwner" />
                  <el-table-column prop="ddcOwnerQuantity" width="100" />
                </el-table>
                <div class="bsn-mt-28">
                  <custom-pagination
                    total={dataInfo.total}
                    currentPage={dataInfo.pageNum}
                    onCurrentChange={currentChange}
                  />
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="bsn-detail-card  bsn-ml-128 bsn-mr-128 bsn-mt-36 bsn-mb-36 bsn-pl-24 bsn-pr-24 bsn-pt-26 bsn-pb-26">
          <div class="card-head bsn-f-22 bsn-f-wb">
            <p>{extension.i18n("DDC_Box_3011")} </p>
          </div>
          <div class="card-content bsn-f-18">
            <el-table
              data={dataInfo.transferList}
              onRowClick={onRowClick}
              showOverflowTooltip={true}
              emptyText={extension.i18n("DDC_Box_3027")}
            >
              <el-table-column
                prop="tradeHash"
                label={extension.i18n("DDC_Box_3012")}
              />
              <el-table-column
                prop="blockHeight"
                label={extension.i18n("DDC_Box_3013")}
              />
              <el-table-column
                prop="tradeTime"
                label={extension.i18n("DDC_Box_3014")}
              />
              <el-table-column
                prop="fromOptChainClientAddress"
                label={extension.i18n("DDC_Box_3015")}
              />
              <el-table-column
                prop="toOptChainClientAddress"
                label={extension.i18n("DDC_Box_3016")}
              />
              <el-table-column
                prop="tradeType"
                formatter={formatterType}
                label={extension.i18n("DDC_Box_3017")}
              />
            </el-table>
            <div class="bsn-mt-28">
              <custom-pagination
                total={dataInfo.transferTotal}
                currentPage={dataInfo.transferPageNum}
                onCurrentChange={TransferList}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
});
