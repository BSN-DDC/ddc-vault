/*
 * @Author: Feix
 * @Date: 2022-02-25 17:10:32
 * @LastEditors: W·S
 * @LastEditTime: 2022-05-18 17:09:26
 * @Description: tools
 */

//@ts-ignore
import { v4 } from "uuid";

/**
 * chrome.i18n封装
 * @param {string} el
 * @returns {string} 内容
 */
const i18n = (el: string): string => {
  if (el) {
    return chrome.i18n.getMessage(el);
  }
  return "--";
};

/**
 * 数组去重
 * @param arr
 * @returns
 */
const unique = (arr: Array<any>): Array<any> => {
  return Array.from(new Set(arr));
};

/**
 * 判断是否为空
 * @param {} obj
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const isEmpty = (obj: any): boolean => {
  if (typeof obj == "object") return false;
  if (typeof obj == "undefined" || obj == null || obj == undefined) return true;
  obj += "";
  return obj.trim() == "";
};

/**
 * 生成uuId
 * @param {int} el 生成位数，默认16位
 * @return {String} uuId
 */
const uuId = (el = 16): string => {
  return v4().replace(/-/g, "").substring(0, el);
};

/**
 * 下载文件
 * @param el {type: 类型（默认txt，可选csv）; val: 内容}
 */
const downloadFile = (el: { type: string; val: string }): void => {
  const element = document.createElement("a");
  let mimeType = "text/plain";
  if (el.type == "txt") {
    mimeType = "text/plain";
  }
  if (el.type == "csv") {
    mimeType = "attachment/csv";
  }
  element.setAttribute(
    "href",
    "data:" + mimeType + ";charset=utf-8," + encodeURIComponent(el.val)
  );
  element.setAttribute("download", uuId(12));
  element.style.display = "none";
  element.click();
};

export function debounce(fn: Function, delay: number): Function {
  let timer: any = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
      timer = setTimeout(fn, delay);
    } else {
      timer = setTimeout(fn, delay);
    }
  };
}

export function throttle(fn: Function, delay: number): Function {
  let valid = true;
  return function () {
    if (!valid) {
      return false;
    }
    valid = false;
    fn();
    setTimeout(() => {
      valid = true;
    }, delay);
  };
}
export { i18n, unique, isEmpty, uuId, downloadFile };
