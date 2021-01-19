const path = require('path')
const fractal = require(path.resolve(process.env.PWD + '/fractal-config.js'))
const fs = require('fs')
const mkdirp = require('mkdirp')
const pretty = require('pretty')
const cliProgress = require('cli-progress')
const prettyHtmlConfig = fractal.get('project.prettyHtmlConfig') || { ocd: true, unformatted: ['script', 'style', 'code', 'pre', 'em', 'strong', 'span'] }
const objects = []
const objectsVars = []
const components = []
const componentsVars = []
const modules = []
const modulesVars = []
const pages = []
const pagesVars = []
// create a new progress bar instance and use shades_classic theme
const progressbar = new cliProgress.SingleBar({
  format: 'progress [{bar}] {percentage}% | {value}/{total} | Filename: {filename}'
}, cliProgress.Presets.shades_classic)
/*
 * Run a static HTML export of modules and pages
 */
try {
  console.log('prettyHtmlConfig', prettyHtmlConfig)
  fractal.components.load().then(async () => {

    const promises = []
    for (const item of fractal.components.flatten()) {
      // if we want to render only ready cmp/pages add "item.status.label === 'Ready'" to if statement
      if (item.hasTag('module')) {
        const type = 'modules'
        modules.push('1')
        mkdirp.sync(`${fractal.get('project.release')}/render/${type}/`)
        for (const variant of item.variants()) {
          modulesVars.push('1')
          const filename = variant.handle.replace(/--default$/, '')
          const promise = variant.render().then(async function (html) {
            progressbar.update({ filename })
            const prettyHtml = await pretty(html, prettyHtmlConfig)
            await fs.writeFile(`${fractal.get('project.release')}/render/${type}/${filename}.html`, prettyHtml, function (err) {
              if (err) {
                console.log('file could not be written!')
              }
            })
            progressbar.increment()
          })
          promises.push(promise)
        }
      } else if (item.hasTag('object')) {
        const type = 'objects'
        objects.push('1')
        mkdirp.sync(`${fractal.get('project.release')}/render/${type}/`)
        for (const variant of item.variants()) {
          objectsVars.push('1')
          const filename = variant.handle.replace(/--default$/, '')
          const promise = variant.render().then(async function (html) {
            progressbar.update({ filename })
            const prettyHtml = await pretty(html, prettyHtmlConfig)
            await fs.writeFile(`${fractal.get('project.release')}/render/${type}/${filename}.html`, prettyHtml, function (err) {
              if (err) {
                console.log('file could not be written!')
              }
            })
            progressbar.increment()
          })
          promises.push(promise)
        }
      } else if (item.hasTag('component')) {
        const type = 'components'
        components.push('1')
        mkdirp.sync(`${fractal.get('project.release')}/render/${type}/`)
        for (const variant of item.variants()) {
          componentsVars.push('1')
          const filename = variant.handle.replace(/--default$/, '')
          const promise = variant.render().then(async function (html) {
            progressbar.update({ filename })
            const prettyHtml = await pretty(html, prettyHtmlConfig)
            await fs.writeFile(`${fractal.get('project.release')}/render/${type}/${filename}.html`, prettyHtml, function (err) {
              if (err) {
                console.log('file could not be written!')
              }
            })
            progressbar.increment()
          })
          promises.push(promise)
        }
      } else if (item.hasTag('page')) {
        const type = 'pages'
        pages.push('1')
        mkdirp.sync(`${fractal.get('project.release')}/render/${type}/`)
        for (const variant of item.variants()) {
          pagesVars.push('1')
          const filename = variant.handle.replace(/--default$/, '')
          const promise = variant.render(item.config.context).then(async function (html) {
            progressbar.update({ filename })
            const prettyHtml = await pretty(html, prettyHtmlConfig)
            await fs.writeFile(`${fractal.get('project.release')}/render/${type}/${filename}.html`, prettyHtml, function(err){
              if (err) {
                console.log('file could not be written!')
              }
            })
            progressbar.increment()
          })
          promises.push(promise)
        }
      }
    }
    progressbar.start(promises.length, 0, {
      filename: "N/A"
    })

    return await Promise.all(promises).then(() => {
      progressbar.stop()
      const objectsNum = objects.length > 0 ? objects.length + objectsVars.length + ' objects, ' : ''
  
      console.log(`Exported ${objectsNum} ${components.length + componentsVars.length} components, ${modules.length + modulesVars.length} modules, ${pages.length + pagesVars.length} pages`)
    })
  })
} catch (e) {
  console.log(e)
}
