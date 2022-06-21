/*
 * @Author: Feix
 * @Date: 2022-02-18 14:13:27
 * @LastEditors: Feix
 * @LastEditTime: 2022-03-28 17:53:54
 * @Description:
 */
import { useRoute, useRouter } from "vue-router";

export const useMixin = (): any => {
  const Route = useRoute();
  const Router = useRouter();
  return {
    Route,
    Router,
  };
};
