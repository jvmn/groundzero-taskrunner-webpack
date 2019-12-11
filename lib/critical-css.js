const fs = require('fs')
const path = require('path')
const projectPath = require('../paths.config.js')
const srcPath = process.env.MODE === 'production' ? projectPath.criticalProd : projectPath.criticalDev
const error = require('./error.js')

module.exports = {
  process: function (filename) {
    try {
      // get the scss file
      const filePath = path.join(srcPath, `../${filename}.css`)
      // console.log(`Critical CSS -> ${process.env.MODE}, srcPath: ${srcPath}, filename: ${filename}, filePath: ${filePath}`)
      const css = fs.readFileSync(filePath).toString('utf8')
      return css
    } catch (err) {
      error(`Critical CSS -> ${err}`, true)
    }
  }
}