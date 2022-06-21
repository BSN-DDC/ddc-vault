/*
 * @Author: Yu Mengxin
 * @Date: 2022-03-18 09:14:24
 * @LastEditors: W·S
 * @LastEditTime: 2022-05-30 16:23:47
 * @FilePath: /ddcvault/src/page/bsn-ddc/views/ddc-home.tsx
 * @Description:
 *
 */
import { defineComponent, ref, reactive } from "vue";
import { ExtensionPlatform } from "@/utils/platforms/extension";
import { getDDCList } from "@/api/DDCQuery";
import { UEACHAIN } from "@/config";
import { useMixin } from "@/mixin";
import { OutDdcSearchControllerSearchesDdc } from "@/api/api_inter";
import CustomPagination from "@/components/CustomPagination";
import { getDDCInfo } from "@/utils/platforms/cryptography";

const extension = new ExtensionPlatform();
export default defineComponent({
  components: { CustomPagination },
  setup() {
    const { Route, Router } = useMixin();
    const ddcInfo = getDDCInfo();
    const chainList = UEACHAIN[ddcInfo.uea as "secp256k1"];
    const tabsModel = ref(chainList[0].id);

    const dataInfo = reactive({
      data: [
        {
          name: "DDC_Box_2040",
          value: ddcInfo.name,
        },
        {
          name: "DDC_Box_2054",
          value: ddcInfo.account,
        },
        {
          name: "DDC_Box_2042",
          value: ddcInfo.uea,
        },
        {
          name: "DDC_Box_2044",
          value: ddcInfo.remark,
        },
        {
          name: "DDC_Box_3032",
          value: 0,
        },
      ],
    });
    const dataInfoList: any = reactive([]);
    const formatterType = (value: any) => {
      if (value.ddcType == "721") return "ERC-721";
      else return "ERC-1155";
    };
    function getDataInfo(
      ddcIdOrDdcOwner: string,
      opbChainId: string,
      index: number
    ) {
      return async function (_currentPage: number) {
        dataInfoList[index].currentPage = _currentPage;
        const _data = await getDDCList({
          page: {
            pageSize: 10,
            pageNum: _currentPage,
          },
          data: {
            captcha: "captcha",
            ddcIdOrDdcOwner,
            ddcType: "",
            opbChainId,
          },
        });
        dataInfoList[index].total = _data.resultPageInfo.total;
        dataInfoList[index].tableData =
          _data.data as Array<OutDdcSearchControllerSearchesDdc>;
        dataInfo.data[4].value = 0;
        for (let index = 0; index < dataInfoList.length; index++) {
          dataInfo.data[4].value += dataInfoList[index].total;
        }
      };
    }

    for (let index = 0; index < chainList.length; index++) {
      dataInfoList.push({
        total: 0,
        currentPage: 1,
        tableData: [] as Array<OutDdcSearchControllerSearchesDdc>,
      });
      dataInfoList[index].onCurrentChange = getDataInfo(
        ddcInfo.account,
        chainList[index].id,
        index
      );
      dataInfoList[index].onCurrentChange(1);
    }

    return () => (
      <div class="bsn-w-100p bsn-h-100p">
        <el-card
          shadow="always"
          class="bsn-w-80p bsn-mt-40 bsn-mb-40 bsn-mlr-auto bsn-f-16"
        >
          {dataInfo.data.map((_item) => {
            return (
              <div class="bsn-box bsn-mt-20">
                <div class="bsn-w-160 bsn-ta-right">
                  {extension.i18n(_item.name) + ":"}
                </div>
                <div class="bsn-box-f1 bsn-pl-20">{_item.value}</div>
              </div>
            );
          })}
        </el-card>
        <el-tabs
          vModel={tabsModel.value}
          type="border-card"
          class="bsn-w-80p bsn-mlr-auto bsn-mt-40"
        >
          {chainList.map((_item, index) => {
            return (
              <el-tab-pane
                label={
                  extension.i18n(_item.name) +
                  " (" +
                  dataInfoList[index].total +
                  ")"
                }
                name={_item.id}
              >
                <el-table
                  data={dataInfoList[index].tableData}
                  class="bsn-mb-30 bsn-w-100p"
                  header-row-class-name="bsn-f-18 bsn-c-black"
                  row-class-name="bsn-f-16"
                >
                  <el-table-column
                    prop="ddcId"
                    label={extension.i18n("DDC_Box_3022")}
                    align="center"
                  />
                  <el-table-column
                    prop="ddcType"
                    label={extension.i18n("DDC_Box_3023")}
                    align="center"
                    formatter={formatterType}
                  />
                  <el-table-column
                    prop="ddcPubTotal"
                    label={extension.i18n("DDC_Box_3024")}
                    align="center"
                  />
                  <el-table-column
                    prop="generateDate"
                    label={extension.i18n("DDC_Box_3026")}
                    align="center"
                  />
                  <el-table-column
                    label={extension.i18n("DDC_Box_0007")}
                    align="center"
                  >
                    {{
                      default: (scope: any) => (
                        <el-button
                          type="primary"
                          text="text"
                          class="bsn-c-theme"
                          onClick={() => {
                            Router.push({
                              name: "DDCDetail",
                              query: {
                                platformDdcId: scope.row.platformDdcId,
                                opcChainName: extension.i18n(_item.name),
                              },
                            });
                          }}
                        >
                          {extension.i18n("DDC_Box_0008")}
                        </el-button>
                      ),
                    }}
                  </el-table-column>
                </el-table>
                <custom-pagination
                  total={dataInfoList[index].total}
                  currentPage={dataInfoList[index].currentPage}
                  onCurrentChange={dataInfoList[index].onCurrentChange}
                />
              </el-tab-pane>
            );
          })}
        </el-tabs>
      </div>
    );
  },
});
