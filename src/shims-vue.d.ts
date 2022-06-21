/*
 * @Author: W·S
 * @Date: 2022-03-04 17:44:07
 * @LastEditors: W·S
 * @LastEditTime: 2022-04-27 11:08:29
 * @Description:
 */
/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare const chrome = window.chrome;
declare const Buffer = window.chrome;
type Buffer = window.chrome;