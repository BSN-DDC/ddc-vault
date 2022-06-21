/*
 * @Author: Shuo Wang
 * @Date: 2021-11-20 17:19:23
 * @Last Modified by:   Shuo  Wang
 * @Last Modified time: 2021-11-20 17:19:23
 * @FileName: Shuo Wang
 */
module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        "Android 4.1",
        "iOS 7.1",
        "Chrome > 31",
        "ff > 31",
        "ie >= 11",
        "last 10 versions",
      ],
      grid: true,
    },
    "postcss-pxtorem": {
      rootValue: 19.2,
      propList: ["*"],
      unitPrecision: 5,
    },
  },
};
