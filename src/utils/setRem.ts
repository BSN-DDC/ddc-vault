/*
 * @Author: W·S
 * @Date: 2022-02-26 11:08:25
 * @LastEditors: W·S
 * @LastEditTime: 2022-03-23 16:49:27
 * @Description:
 */
export function utiles_setRem() {
  // 初始化
  setRem();
  // 改变窗口大小时重新设置 rem
  window.addEventListener(
    "resize",
    () => {
      setTimeout(setRem, 300);
    },
    false
  );
  window.addEventListener(
    "pageshow",
    (e) => {
      if (e.persisted) {
        setTimeout(setRem, 300);
      }
    },
    false
  );
}
let widthNum = 0;
const baseSize = 19.2;
// 设置 rem 函数
function setRem() {
  // if (document.documentElement.clientWidth < window.screen.width * 0.8) return;
  widthNum = window.screen.width;
  // if (widthNum > 1400)
  widthNum = 1920;
  // widthNum = document.documentElement.clientWidth;
  const scale = widthNum / 1920;

  document.documentElement.style.fontSize = `${baseSize * scale}px`;
  document.getElementsByTagName("html")[0].style.fontSize = `${
    baseSize * scale
  }px`;
}
