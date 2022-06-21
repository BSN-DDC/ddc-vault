/*
 * @Author: Yu Mengxin
 * @Date: 2022-03-23 15:36:09
 * @LastEditors: W·S
 * @LastEditTime: 2022-04-29 16:56:35
 * @FilePath: /ddcvault/src/plugins/axios.ts
 * @Description:
 *
 */
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
// @ts-ignore
import { ElMessage } from "./element-ui";
import { i18n } from "@/utils/tools";
import { ExtensionPlatform } from "@/utils/platforms/extension";
const extension = new ExtensionPlatform();
let reqNum = 0;
// const API = "http://10.0.49.4:8080"; //测试环境
const API = "https://ddc.bsnbase.com"; //测试环境
const CancelToken = axios.CancelToken;
const pending: Map<any, any> = new Map();
const codeMessage: any = {
  400: extension.i18n("HTTP_STATUS_400"),
  401: extension.i18n("HTTP_STATUS_401"),
  403: extension.i18n("HTTP_STATUS_403"),
  404: extension.i18n("HTTP_STATUS_404"),
  // 500: i18n("HTTP_STATUS_500"),
  502: extension.i18n("HTTP_STATUS_502"),
  503: extension.i18n("HTTP_STATUS_503"),
  504: extension.i18n("HTTP_STATUS_504"),
};

const Service = axios.create({
  baseURL: API,
  // baseURL: "/api",
  timeout: 60000,
  headers: {
    "x-requested-with": "XMLHttpRequest",
    "x-frame-options": "SAMEORIGIN",
    "X-Content-Type-Options": "nosniff",
  },
});

Service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (reqNum == 0)
      (document.getElementById("ID_BSNDDC") as any).style.display = "";
    reqNum++;
    const configUrl =
      config.url + (config.data ? JSON.stringify(config.data) : "");
    if (pending.has(configUrl)) pending.get(configUrl)();

    config.cancelToken = new CancelToken((c) => {
      pending.set(configUrl, c);
    });
    return config;
  },
  (error) => {
    console.error("interceptors.request.error", error.message);
    throw error;
  }
);

Service.interceptors.response.use(
  (response: AxiosResponse) => {
    const configUrl =
      response.config.url +
      (response.config.data ? JSON.stringify(response.config.data) : "");
    reqNum--;
    if (reqNum == 0)
      (document.getElementById("ID_BSNDDC") as any).style.display = "none";
    if (
      response.data.code == 0 ||
      response.data.code == -1 ||
      response.data.code == -2 ||
      response.data.code == -3
    ) {
      switch (response.data.code) {
        case -1: // 接口报错(联调错误) code==-1 时不处理任何错误,此为后台接口错误;
          console.error(
            "code === " +
              response.data.code +
              " => " +
              extension.i18n(response.data.message) +
              ""
          );
          ElMessage({
            message:
              extension.i18n("MSG_00000001") +
              ": " +
              response.data.errorLogCode,
            grouping: true,
            type: "error",
          });
          break;
        case -2: // 逻辑错误,需前端逻辑判断 前缀：MSG_100XXXXX-弹框,MSG_200XXXX-走逻辑 ）具体处理业务逻辑
          ElMessage({
            message: "" + extension.i18n(response.data.message) + "",
            grouping: true,
            type: "error",
          });
          break;
      }
      pending.delete(configUrl);
      return response.data;
    }

    // 其他错误
    ElMessage({
      message: "" + i18n(response.data.message) + "",
      grouping: true,
      type: "error",
    });
    pending.delete(configUrl);
    return response.data;
  },
  (error) => {
    reqNum--;
    if (reqNum == 0)
      if (error.response) {
        (document.getElementById("ID_BSNDDC") as any).style.display = "none";
        const configUrl =
          error.response.config.url +
          (error.response.config.data
            ? JSON.stringify(error.response.config.data)
            : "");
        pending.delete(configUrl);
        const status = error.response.status;
        if (status === 500 || status === 400) {
          if (error.response.data.code == -1) {
            // console.error(
            //   "code === " +
            //     error.response.data.code +
            //     " => " +
            //     extension.i18n(error.response.data.message) +
            //     ""
            // );
            ElMessage({
              message:
                extension.i18n("MSG_00000001") +
                ": " +
                extension.i18n(error.response.data.message) +
                ", errorLogCode:" +
                error.response.data.errorLogCode,
              grouping: true,
              type: "error",
            });
          }
        } else if (status === 404) {
          ElMessage({
            message: extension.i18n("HTTP_STATUS_404"),
            grouping: true,
            type: "info",
          });
        } else {
          ElMessage({
            message: codeMessage[status] || extension.i18n("HTTP_STATUS_500"),
            grouping: true,
            type: "error",
          });
        }
      } else if (error.message.indexOf("timeout") >= 0) {
        ElMessage({
          message: extension.i18n("HTTP_STATUS_timeout"),
          grouping: true,
          type: "error",
        });
      }
    console.error("interceptors.request.error", error.message);
    throw error;
  }
);
export default Service;
