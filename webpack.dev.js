const { merge } = require('webpack-merge')
const fs = require('fs')
const webpack = require('webpack')
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
  mode: 'development',
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'dev' // use 'development' unless process.env.NODE_ENV is defined
    }),
  ],
  stats: {
    assets: false,
    cached: false,
    cachedAssets: false,
    entrypoints: false,
    hash: false,
    children: false,
    reasons: false,
    version: false,
    outputPath: false,
    chunkOrigins: false,
    colors: true
  },
  // https://webpack.js.org/configuration/devtool/ for other options
  devtool: 'eval-cheap-source-map',
})