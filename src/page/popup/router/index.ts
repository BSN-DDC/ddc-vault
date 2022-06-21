/*
 * @Author: W·S
 * @Date: 2022-03-08 10:18:17
 * @LastEditors: W·S
 * @LastEditTime: 2022-05-30 14:55:37
 * @Description:
 */
import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHashHistory } from "vue-router";
import { ExtensionPlatform } from "@/utils/platforms/extension";
import CustomHeader from "@/components/CustomHeader";
import {
  DDCSDB,
  getDDCAddAccount,
  getDDCSign,
  removeDDCAddAccount,
  removeDDCSign,
  setDDCAddAccount,
  setDDCSign,
} from "@/utils/platforms/cryptography";
import AppIndex from "../views/app-interactive/app-index";
import AppHome from "../views/app-interactive/app-home";
import AppSelect from "../views/app-interactive/app-select";
import AppSign from "../views/app-interactive/app-sign";

const ddcsdb = new DDCSDB();
const extension = new ExtensionPlatform();
const pathIndex = "/app-index";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "",
    component: CustomHeader,
    redirect: "/app-index",
    children: [
      {
        path: "app-index",
        name: "AppIndex",
        component: AppIndex,
        meta: {
          show: true,
          show1: false,
          show2: false,
        },
      },
      {
        path: "app-home",
        name: "AppHome",
        component: AppHome,
        meta: {
          show: true,
          show1: true,
          show2: true,
        },
      },
      {
        path: "app-sign",
        name: "AppSign",
        component: AppSign,
        meta: {
          show: false,
          show1: false,
          show2: false,
        },
      },
      {
        path: "app-select",
        name: "AppSelect",
        component: AppSelect,
        meta: {
          show: false,
          show1: false,
          show2: false,
        },
      },
    ],
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
router.beforeEach(async (to, from, next) => {
  const promis = await Promise.all([
    ddcsdb.getPassW(),
    ddcsdb.getDdcMne(),
    ddcsdb.getDdcSta(),
    extension.getLocal("ddcSign"),
    extension.getLocal("ddcAddAccount"),
    senMessage(),
  ]);

  if (promis[3]) {
    setDDCSign(promis[3]);
  }
  if (promis[4]) {
    setDDCAddAccount(promis[4]);
  }
  if (!promis[0] || !promis[1]) {
    removeDDCSign();
    removeDDCAddAccount();
    await extension.removeLocal("ddcSign");
    await extension.removeLocal("ddcAddAccount");
    extension.platform.tabs.create(
      { url: extension.platform.runtime.getURL("home.html") },
      () => {}
    );
    extension.platform.windows.getCurrent((red: any) => {
      extension.platform.windows.remove(red.id);
    });
    to.path === pathIndex ? next() : next(pathIndex);
  } else if (promis[2] >= 10 && promis[5] >= 10) {
    if (to.path === "/app-sign" && getDDCSign()) {
      extension.removeLocal("ddcSign");
      return next();
    } else if (to.path === "/app-select" && getDDCAddAccount()) {
      extension.removeLocal("ddcAddAccount");
      return next();
    } else if (promis[3]) {
      return next("/app-sign");
    } else if (promis[4]) {
      return next("/app-select");
    } else to.path === pathIndex ? next("/app-home") : next();
  } else to.path === pathIndex ? next() : next(pathIndex);
});
export default router;
export async function senMessage(): Promise<any> {
  return new Promise((resolve) => {
    extension.platform.runtime.sendMessage(
      { cmd: "ddc_sign", data: "" },
      (response: any) => {
        resolve(response);
      }
    );
  });
}
