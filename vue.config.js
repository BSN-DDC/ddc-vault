/*
 * @Author: W·S
 * @Date: 2022-03-04 18:09:16
 * @LastEditors: W·S
 * @LastEditTime: 2022-05-18 17:13:23
 * @Description:
 */
const CopyPlugin = require("copy-webpack-plugin");
const pages = {};
const chromeName = ["popup", "home", "bsn-ddc"];
const chromeJsName = ["content"];
chromeName.forEach((name) => {
  pages[name] = {
    entry: `src/page/${name}/main.ts`,
    template: `src/page/${name}/index.html`,
    filename: `${name}.html`,
  };
});
chromeJsName.forEach((name) => {
  pages[name] = `src/scripts/${name}.ts`;
});

module.exports = {
  pages,
  productionSourceMap: false,

  configureWebpack: {
    devtool: "cheap-module-source-map",
    plugins: [
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require("unplugin-element-plus/webpack")({}),
      new CopyPlugin([
        {
          from: "./src/assets/manifest.json",
          to: "./",
        },
        {
          from: "./src/assets/background-loader.js",
          to: "./",
        },
        {
          from: "./src/assets/inject.js",
          to: "./js",
        },
        {
          from: "./src/locales",
          to: "./",
        },
      ]),
    ],
  },

  devServer: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        // target: "http://10.0.7.71:18000", // 测试地址
        target: "https://ddc.bsnbase.com", // 生产环境
        changeOrigin: true,
        // rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },

  css: {
    extract: true,
  },
};
