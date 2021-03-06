const fs = require('fs')
const sass = require('sass')
const autoprefixer = require('autoprefixer')
const postcss = require('postcss')
const csso = require('csso')
const error = require('./error.js')
const projectPath = require('../paths.config.js')

module.exports = {
  /**
   * Convers scss file to minified css, optionaly with autoprifixer and injects the css
   * @param {String} cssPath - Path to scss file
   * @param {Boolean} useAutoprefixer - default true
   */
  process: function (cssPath, useAutoprefixer = true) {
    try {
      // get the scss file
      const file = fs.readFileSync(cssPath).toString('utf8')
      // convert scss to css
      const cssStream = sass.renderSync({
        includePaths: [projectPath.dev],
        data: file,
      })
      // autoprefix
      let css = ''
      if (useAutoprefixer) {
        // [autoprefixer({ grid: 'autoplace' })]
        css = postcss([autoprefixer]).process(cssStream.css, { from: undefined }).css
      } else {
        css = cssStream.css.toString()
      }
      // fix font paths
      css = css.replace(/(\.\.\/fonts\/)/gm, '/assets/fonts/')
      // minify
      const minifiedCss = csso.minify(css).css
      // return string
      return '/* critical css injection */\n' + minifiedCss
    } catch (err) {
      error(`Critical CSS -> ${err}`, true)
    }
  }
}

/** using Webpack config
// package.json -> "watch:critical": "webpack --config $WEBPACK_CRITICAL_CONFIG --watch"
// watch script fails when no entry files found...

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
*/