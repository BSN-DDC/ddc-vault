/*
 * @Author: W·S
 * @Date: 2022-02-26 14:44:39
 * @LastEditors: W·S
 * @LastEditTime: 2022-03-24 11:05:44
 * @Description:
 */
import {
  ElTag,
  ElMessage,
  ElMessageBox,
  ElAlert,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElButton,
  ElCheckbox,
  ElCol,
  ElConfigProvider,
  ElDialog,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElForm,
  ElFormItem,
  ElIcon,
  ElImage,
  ElInput,
  ElSelect,
  ElMenu,
  ElMenuItem,
  ElPagination,
  ElPopover,
  ElRadio,
  ElRow,
  ElTable,
  ElTableColumn,
  ElTabPane,
  ElTabs,
  ElTooltip,
  ElDivider,
  ElCard,
  ElAvatar,
  ElScrollbar,
} from "element-plus";
import {
  ArrowDown,
  ArrowUp,
  ArrowLeftBold,
  Plus,
  Download,
  View,
  Sunny,
} from "@element-plus/icons-vue";
export default function useEle(app) {
  app.component("Sunny", Sunny);
  app.component("View", View);
  app.component("Download", Download);
  app.component("Plus", Plus);
  app.component("ArrowLeftBold", ArrowLeftBold);
  app.component("ArrowDown", ArrowDown);
  app.component("ArrowUp", ArrowUp);
  app.config.globalProperties.ElMessageBox = ElMessageBox;
  app.config.globalProperties.ElMessage = ElMessage;
  app.use(ElTag);
  app.use(ElMessageBox);
  app.use(ElScrollbar);
  app.use(ElAvatar);
  app.use(ElAlert);
  app.use(ElDialog);
  app.use(ElButton);
  app.use(ElRadio);
  app.use(ElCheckbox);
  app.use(ElForm);
  app.use(ElFormItem);
  app.use(ElImage);
  app.use(ElInput);
  app.use(ElSelect);
  app.use(ElRow);
  app.use(ElCol);
  app.use(ElMenu);
  app.use(ElMenuItem);
  app.use(ElTable);
  app.use(ElTableColumn);
  app.use(ElBreadcrumb);
  app.use(ElBreadcrumbItem);
  app.use(ElDropdown);
  app.use(ElDropdownMenu);
  app.use(ElDropdownItem);
  app.use(ElTabs);
  app.use(ElTabPane);
  app.use(ElPopover);
  app.use(ElTooltip);
  app.use(ElPagination);
  app.use(ElIcon);
  app.use(ElConfigProvider);
  app.use(ElDivider);
  app.use(ElCard);
}
export { ElMessage };
