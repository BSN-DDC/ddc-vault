/*
 * @Author: W·S
 * @Date: 2022-03-08 10:18:17
 * @LastEditors: W·S
 * @LastEditTime: 2022-04-25 18:56:53
 * @Description:
 */
import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHashHistory } from "vue-router";
import CustomHeader from "@/components/CustomHeader";
import DDCHome from "../views/ddc-home";
import DDCDetail from "../views/ddc-detail";
import DealDetail from "../views/deal-detail";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/bsn-ddc",
    name: "BSNDDC",
    component: CustomHeader,
    children: [
      {
        path: "ddc-home",
        name: "DDCHome",
        component: DDCHome,
      },
      {
        path: "ddc-detail",
        name: "DDCDetail",
        component: DDCDetail,
      },
      {
        path: "deal-detail",
        name: "DealDetail",
        component: DealDetail,
      },
    ],
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
