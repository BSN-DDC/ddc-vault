/*
 * @Author: W·S
 * @Date: 2022-04-25 16:09:43
 * @LastEditors: W·S
 * @LastEditTime: 2022-04-25 16:22:01
 * @FilePath: /ddcvault/src/page/bsn-ddc/main.ts
 * @Description:
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
