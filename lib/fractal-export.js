const path = require('path')
const fractal = require(path.resolve(process.env.PWD + '/fractal-config.js'))
const fs = require('fs')
const mkdirp = require('mkdirp')
const pretty = require('pretty')
const prettyHtmlConfig = { ocd: true, unformatted: ['script', 'style', 'code', 'pre', 'em', 'strong', 'span'] }
let objects = []
let objectsVars = []
let components = []
let componentsVars = []
let modules = []
let modulesVars = []
let pages = []

/*
 * Run a static HTML export of modules and pages
 */
try {
  fractal.components.load().then(() => {
    for (let item of fractal.components.flatten()) {
      // if we want to render only ready cmp/pages add "item.status.label === 'Ready'" to if statement
      if (item.hasTag('module')) {
        const type = 'modules'
        modules.push('1')
        mkdirp(`${fractal.get('project.release')}/render/${type}/`, function () {
          for (let variant of item.variants()) {
            modulesVars.push('1')
            let filename = variant.handle.replace(/--default$/, '')
            variant.render().then(function (html) {
              const prettyHtml = pretty(html, prettyHtmlConfig)
              fs.writeFile(`${fractal.get('project.release')}/render/${type}/${filename}.html`, prettyHtml, function (err) {
                if (err) {
                  console.log('file could not be written!')
                }
              })
            })
          }
        })
      } else if (item.hasTag('object')) {
        const type = 'objects'
        objects.push('1')
        mkdirp(`${fractal.get('project.release')}/render/${type}/`, function () {
          for (let variant of item.variants()) {
            objectsVars.push('1')
            let filename = variant.handle.replace(/--default$/, '')
            variant.render().then(function (html) {
              const prettyHtml = pretty(html, prettyHtmlConfig)
              fs.writeFile(`${fractal.get('project.release')}/render/${type}/${filename}.html`, prettyHtml, function (err) {
                if (err) {
                  console.log('file could not be written!')
                }
              })
            })
          }
        })
      } else if (item.hasTag('component')) {
        const type = 'components'
        components.push('1')
        mkdirp(`${fractal.get('project.release')}/render/${type}/`, function () {
          for (let variant of item.variants()) {
            componentsVars.push('1')
            let filename = variant.handle.replace(/--default$/, '')
            variant.render().then(function (html) {
              const prettyHtml = pretty(html, prettyHtmlConfig)
              fs.writeFile(`${fractal.get('project.release')}/render/${type}/${filename}.html`, prettyHtml, function (err) {
                if (err) {
                  console.log('file could not be written!')
                }
              })
            })
          }
        })
      } else if (item.hasTag('page')) {
        const type = 'pages'
        pages.push('1')
        mkdirp(`${fractal.get('project.release')}/render/${type}/`, function () {
          for (let variant of item.variants()) {
            let filename = variant.handle.replace(/--default$/, '')
            variant.render(item.config.context).then(function (html) {
              const prettyHtml = pretty(html, prettyHtmlConfig)
              fs.writeFile(`${fractal.get('project.release')}/render/${type}/${filename}.html`, prettyHtml, function(err){
                if (err) {
                  console.log('file could not be written!')
                }
              })
            })
          }
        })
      }
    }
    const objectsNum = objects.length > 0 ? objects.length + objectsVars.length + ' objects, ' : ''

    console.log(`Exported ${objectsNum} ${components.length + componentsVars.length} components, ${modules.length + modulesVars.length} modules, ${pages.length} pages`)
  })
} catch (e) {
  console.log(e)
}
