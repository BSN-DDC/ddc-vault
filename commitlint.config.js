/*
 * @Author: W·S
 * @Date: 2022-05-09 17:33:27
 * @LastEditors: W·S
 * @LastEditTime: 2022-05-09 17:38:57
 * @FilePath: /ddcvault/commitlint.config.js
 * @Description:
 */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "test", "revert"],
    ],
  },
};
