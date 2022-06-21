/*
 * @Author: W·S
 * @Date: 2022-04-20 15:30:54
 * @LastEditors: W·S
 * @LastEditTime: 2022-05-18 18:03:26
 * @FilePath: /ddcvault/src/components/CustomPagination.tsx
 * @Description:
 */
import { ExtensionPlatform } from "@/utils/platforms/extension";
import { defineComponent, ref } from "vue";

export default defineComponent({
  emits: ["currentChange"],
  props: {
    // 每页显示条数
    pageSize: {
      required: false,
      type: Number,
      default: () => 10,
    },
    // 总条数
    total: {
      required: true,
      type: Number,
      default: () => 0,
    },
    // 当前页数
    currentPage: {
      required: true,
      type: Number,
      default: () => 1,
    },
  },
  setup(prop, emits) {
    const extension = new ExtensionPlatform();
    const onCurrentChange = (_currentPage: number) => {
      emits.emit("currentChange", _currentPage);
    };

    return () => (
      <div class="bsn-box bsn-box-pj bsn-f-14">
        {prop.total >= 1 ? (
          <>
            <div>
              {extension
                .i18n("DDC_Box_0013")
                .replace(
                  "A1",
                  (prop.currentPage - 1) * 10 +
                    1 +
                    "~" +
                    (prop.currentPage * 10 > prop.total
                      ? prop.total
                      : prop.currentPage * 10)
                )
                .replace("A2", prop.total + "")}
            </div>
            <el-pagination
              background={true}
              layout="prev, pager, next"
              pageSize={prop.pageSize}
              total={prop.total}
              onCurrentChange={onCurrentChange}
            />
          </>
        ) : null}
      </div>
    );
  },
});
