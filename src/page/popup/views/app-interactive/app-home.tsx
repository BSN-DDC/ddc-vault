/*
 * @Author: W·S
 * @Date: 2022-04-18 14:17:13
 * @LastEditors: W·S
 * @LastEditTime: 2022-05-16 23:49:43
 * @FilePath: /ddcvault/src/page/popup/views/app-interactive/app-home.tsx
 * @Description:
 */
import type { AccountInformation } from "@/inter";
import type { Ref } from "vue";
import { defineComponent, reactive, ref } from "vue";
import CustomPagination from "@/components/CustomPagination";
import { ExtensionPlatform } from "@/utils/platforms/extension";
import { DDCSDB } from "@/utils/platforms/cryptography";
import { ACTIONS, APPACCOUNTS } from "@/config";
import { _sha256 } from "@/utils/platforms/crypto";
import AppHomeDialog from "./app-home-dialog";
interface refDialogPropInformation extends AccountInformation {
  type: string;
  title: string;
}
const extension = new ExtensionPlatform();
const ddcdb = new DDCSDB();

export default defineComponent({
  components: { CustomPagination, AppHomeDialog },
  setup() {
    const refShowDialog: any = ref(false);
    const refDialogProp: Ref<refDialogPropInformation> = ref({
      type: "",
      title: "",
      account: "",
      privatekey: "",
      name: "",
      uea: "",
    });

    const actionOnClick = (
      _key: string,
      __account: AccountInformation,
      _title: string
    ) => {
      refDialogProp.value.type = __account.type;
      refDialogProp.value.account = __account.account;
      refDialogProp.value.privatekey = __account.privatekey;
      refDialogProp.value.name = __account.name;
      refDialogProp.value.uea = __account.uea;
      refDialogProp.value.remark = __account.remark;
      refDialogProp.value.type = _key;
      refDialogProp.value.title = _title;
      refShowDialog.value.value = true;
    };

    const dataInfo = reactive({
      total: 0,
      currentPage: 1,
      tableData: [] as Array<AccountInformation>,
    });

    const onCurrentChange = async (_currentPage: number) => {
      console.log(_currentPage);

      dataInfo.currentPage = _currentPage;
      const _data: Array<AccountInformation> = await ddcdb.getDdcAcc();
      dataInfo.total = _data.length;
      dataInfo.tableData = _data.splice(
        (_currentPage - 1) * 10,
        _currentPage * 10 > _data.length ? _data.length : _currentPage * 10
      );
      console.log(dataInfo.tableData);
    };

    ddcdb.storageChanged((_changes: any, _namespace: any) => {
      for (let [key] of Object.entries(_changes)) {
        if (key === APPACCOUNTS) {
          ddcdb.getDdcAcc().then((_data) => {
            dataInfo.total = _data.length;
            dataInfo.tableData = _data.splice(
              (dataInfo.currentPage - 1) * 10,
              dataInfo.currentPage * 10 > _data.length
                ? _data.length
                : dataInfo.currentPage * 10
            );
          });
          return;
        } else continue;
      }
    });

    onCurrentChange(dataInfo.currentPage);

    return () => (
      <div class="bsn-box-f1">
        <div class="bsn-h-94" style="background: #312E2D;"></div>
        <el-card
          shadow="always"
          class="bsn-w-80p bsn-mt-40 bsn-mb-40 bsn-mlr-auto"
        >
          {{
            header: () => (
              <span class="bsn-f-wb bsn-f-22">
                {extension.i18n("DDC_Box_2045")}
              </span>
            ),
            default: () => (
              <>
                <el-table
                  data={dataInfo.tableData}
                  class="bsn-mb-30 bsn-w-100p"
                  header-row-class-name="bsn-f-18 bsn-c-black"
                  row-class-name="bsn-f-16"
                >
                  <el-table-column
                    label={extension.i18n("DDC_Box_2040")}
                    prop="name"
                    minWidth="15%"
                  />
                  <el-table-column
                    label={extension.i18n("DDC_Box_2041")}
                    prop="account"
                    minWidth="30%"
                  />
                  <el-table-column
                    label={extension.i18n("DDC_Box_2042")}
                    prop="uea"
                    minWidth="10%"
                  />
                  <el-table-column
                    label={extension.i18n("DDC_Box_2044")}
                    prop="remark"
                    minWidth="20%"
                  />
                  <el-table-column
                    label={extension.i18n("DDC_Box_2043")}
                    prop="actions"
                    minWidth="25%"
                  >
                    {{
                      default: (scope: { row: { address: string } }) => {
                        return ACTIONS.map((item: any) => {
                          return (
                            <el-button
                              type="primary"
                              text="text"
                              onClick={() => {
                                item.action(scope.row, actionOnClick);
                              }}
                            >
                              {extension.i18n(item.name)}
                            </el-button>
                          );
                        });
                      },
                    }}
                  </el-table-column>
                </el-table>
                <custom-pagination
                  total={dataInfo.total}
                  currentPage={dataInfo.currentPage}
                  onCurrentChange={onCurrentChange}
                />
              </>
            ),
          }}
        </el-card>
        <app-home-dialog
          dialogProp={refDialogProp.value}
          init={(_val: any) => {
            refShowDialog.value = _val;
          }}
        ></app-home-dialog>
      </div>
    );
  },
});
