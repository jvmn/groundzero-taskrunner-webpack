const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const TerserJSPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const getProjectJsonPath = () => `${process.env.PROJECT_CWD}/package.json`
const VERSION = require(getProjectJsonPath()).version
const FULLBUILD = new Date()
const distPath = path.join(process.env.PROJECT_CWD, './release/assets/js/min')

let baseConfig
// check if we have a webpack.config in project root
try {
  fs.accessSync(`${process.env.PROJECT_CWD}/webpack.config.js`, fs.constants.R_OK | fs.constants.W_OK)
  const getConfigPath = () => `${process.env.PROJECT_CWD}/webpack.config.js`
  baseConfig = require(getConfigPath())
  console.log('✳️  using local webpack.config!')
} catch (err) {
  const getConfigPath = () => `${process.env.PWD}/webpack.config.js`
  baseConfig = require(getConfigPath())
  console.log('⚛︎  using Taskrunner webpack.config!')
}

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: distPath,
    chunkFilename: 'jvm-[name]-[fullhash].min.js',
    filename: 'jvm-[name].min.js'
  },
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // path is relative to the distPath, see prod path
      filename: '../../css/[name].min.css',
      chunkFilename:'../../css/[id].[fullhash].css'
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static'
    }),
    new webpack.BannerPlugin({
      // print comments on top of each bundle file
      banner: `! @preserve: Release version: ${JSON.stringify(VERSION)}, Build date: ${JSON.stringify(FULLBUILD)}, hash:[fullhash], chunkhash:[chunkhash], name:[name]`
    }),
    // don't create too small chunks here..
    // if you only want one large chunk you can set this to higher values
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 10000
    })
  ],
})