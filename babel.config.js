const getProjectConfig = () => `${process.env.PROJECT_CWD}/project.config.js`
const config = require(getProjectConfig())
const useTs = config.taskrunner.ts

const presets = useTs
  ? [
    "@babel/preset-typescript",
    ["@babel/preset-env", { useBuiltIns: "entry", corejs: "3.0" }],
  ]
  : ["@babel/env"]

const plugins = useTs
  ? [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-class-properties",
    "@babel/transform-runtime",
  ]
  : ["@babel/plugin-syntax-dynamic-import"]

module.exports = function (api) {
  api.cache(true)

  return {
    presets,
    plugins,
  }
}
