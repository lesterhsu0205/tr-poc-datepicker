const webpack = require('webpack')
const path = require('path')

module.exports = {
  publicPath: './',
  devServer: {
    compress: true,
    port: 9000,
    overlay: {
      warnings: true,
      errors: true
    }
  },

  // module: {
  //     rules: [{
  //         test: /\.scss$/,
  //         use: [
  //             "style-loader", // 将 JS 字符串生成为 style 节点
  //             "css-loader", // 将 CSS 转化成 CommonJS 模块
  //             "sass-loader" // 将 Sass 编译成 CSS，默认使用 Node Sass
  //         ]
  //     }]
  // },
  // css: {
  //     loaderOptions: {
  //         sass: {
  //             data:
  //                 '@import "node_modules/vue-snotify/styles/material.scss";'
  //         }
  //     }
  // },
  configureWebpack: {
    // devtool: 'source-map',
    plugins: [
      new webpack.ProvidePlugin({
        // $: 'jquery',
        // jQuery: 'jquery',
        // jquery: 'jquery',
        // 'window.jQuery': 'jquery',
        // axios: 'axios',
        // moment: 'moment',
        // Chart: 'chart.js'
      })
    ]
  }
}
