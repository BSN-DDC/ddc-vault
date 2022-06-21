/*
 * @Author: W·S
 * @Date: 2022-03-08 10:18:17
 * @LastEditors: Feix
 * @LastEditTime: 2022-04-15 16:58:30
 * @Description: 引导页路由
 */
import OneBox from "../components/OneBox";
import CreatePwd from "../components/CreatePwd";
import MnemonicBox from "../components/MnemonicBox";
import { createRouter, createWebHashHistory } from "vue-router";
import { DDCSDB } from "@/utils/platforms/cryptography";
const ddcsdb = new DDCSDB();
const routes = [
  { path: "/", component: OneBox },
  { path: "/create-pwd", component: CreatePwd },
  { path: "/mnemonic-box", component: MnemonicBox },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(beforeEach);

const newOpen = (url: string) => {
  window.open(chrome.runtime.getURL(url + ".html"), "_top");
};

async function beforeEach(to: any, from: any, next: any) {
  const pwd = await ddcsdb.getPassW();
  const moe = await ddcsdb.getDdcMne();
  // 已生成助记词路由拦截
  if (to.path === "/" && pwd && moe) {
    newOpen("popup");
  } else if (to.path === "/create-pwd") {
    if ((to.query.stepNode == "20" || to.query.stepNode == "21") && pwd) {
      newOpen("popup");
    } else {
      next();
    }
  } else if (to.path === "/mnemonic-box") {
    if (!pwd) {
      next("/");
    } else if (moe) {
      newOpen("popup");
    } else {
      next();
    }
  } else {
    next();
  }
}
export default router;
