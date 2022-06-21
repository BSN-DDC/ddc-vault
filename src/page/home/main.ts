/*
 * @Author: W·S
 * @Date: 2022-02-26 14:40:59
 * @LastEditors: Feix
 * @LastEditTime: 2022-04-15 16:58:50
 * @Description: 引导页 main
 */
import { createApp } from "vue";
import App from "./App";
import "@/css/bsn-ui.scss";
import "@/css/bsn-img.scss";
import "@/css/local.scss";
// @ts-ignore
import useEle from "@/plugins/element-ui";
import router from "./router";
const app = createApp(App);
useEle(app);
app.use(router);
app.mount("#app");
