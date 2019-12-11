console.log('using babel default')
module.exports = function (api) {
  api.cache(true)

  const presets = [
    ["@babel/env", {
      // modules: false,
      // for uglifyjs...
      forceAllTransforms: process.env === "production"
    }],
  ]
  const plugins = []

  return {
    presets,
    plugins
  }
}