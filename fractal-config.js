'use strict'
const fs = require('fs')
const path = require('path')
const projectPath = require(path.resolve(process.env.PWD + '/paths.config.js'))
const fractal = module.exports = require('@frctl/fractal').create()
const bluebird = require('bluebird')
const getPackageJsonPath = () => `${process.env.PROJECT_CWD}/package.json`
const getProjectConfig = () => `${process.env.PROJECT_CWD}/project.config.js`
const packageJson = require(getPackageJsonPath())
const config = require(getProjectConfig())
const _ = require('lodash')

/**
 * Prevent Bluebird warnings like "a promise was created in a handler but was not returned from it"
 * caused by Nunjucks from polluting the console
 */
bluebird.config({
  warnings: false
})

/*
 * Configure a Fractal instance.
 */

/*
* Give your project meta data.
* imported from the project.config.js
*/
for (const key in config.fractal) {
  fractal.set('project.' + key, config.fractal[key])
}
fractal.set('project.buildDate', new Date())
fractal.set('project.version', packageJson.version)

/**
 * set file variables for file headers which will be set by preprocessor
 */
fractal.set('fileVars', {
  COPYRIGHT_INFO: fractal.get('project.info'),
  PROJECT_WEB_URL: fractal.get('project.url'),
  PROJECT_WEB_TITLE: fractal.get('project.title'),
  PROJECT_NAMESPACE: fractal.get('project.namespace'),
  PROJECT_VERSION: fractal.get('project.version'),
  CHANGE_DATE: fractal.get('project.buildDate')
})

/**
 * set paths
 */
fractal.web.set('builder.dest', projectPath.build) // destination for the build export
fractal.web.set('static.path', projectPath.webui) // destination for the preview export
fractal.docs.set('path', projectPath.docs) // location of the documentation directory.
fractal.components.set('path', projectPath.dev) // location of the component directory.
fractal.set('project.release', projectPath.release) // release directory to static assets and files for
fractal.components.set('default.context', {
  'gblSpriteSheet': '../../assets/img/sprite-icons/AP_sprite.svg'
})

/**
 * Which layout (specified by it’s handle) to use to when rendering previews of this layout
 */
fractal.components.set('default.preview', '@preview-all')

/**
 * set title of pattern lib in the web view navigation bar (doesn't need to be changed)
 */
fractal.components.set('title', 'Patterns')
fractal.components.set('label', 'Patterns')

/**
 * set theme configs
 */

/**
 * CLI Command to compile all components and check on errors
 * $ fractal check-erros
 */
fractal.cli.command('check-errors', function (opts, done) {
  process.on('unhandledRejection', () => { }) // workaround for poor error catching in the views!
  fractal.load().then(src => {
    for (let comp of fractal.components.flatten()) {
      comp.render().then(html => {
        this.console.success('@' + comp.handle + ': ' + html)
      }).catch(error => {
        this.console.error('@' + comp.handle + ': ' + error.message + ' ' + src)
      })
    }
  })
  done()
})

/**
 * Fractal server config defaults
 */
let fractalServerConfig = {
  sync: true,
  port: 3000,
  watch: true,
  logLevel: 'debug',
  syncOptions: {
    notify: true,
    watchOptions: {
      ignored: ['/**/*.scss'],
      ignoreInitial: true,
      files: [],
    }
  }
}

let mandelbrotDefaults = {
  skin: "white",
  styles: ['default', '/theme-overrides/assets/css/theme-overrides.css'],
  scripts: [
    "/theme-overrides/assets/js/polyfills.min.js",
    "default",
  ]
}

// check if we have a fractal.hooks in project root
try {
  fs.accessSync(`${process.env.PROJECT_CWD}/fractal.hooks.js`, fs.constants.R_OK | fs.constants.W_OK)
  const config = require(`${process.env.PROJECT_CWD}/fractal.hooks.js`)

  if (config.server) {
    fractalServerConfig = _.defaultsDeep(config.server, fractalServerConfig)
    console.error('found Fractal server config in project!')
  }

  if (config.mandelbrot) {
    mandelbrotDefaults = _.defaultsDeep(config.mandelbrot, mandelbrotDefaults)
    console.error('found Fractal mandelbrot config in project!')
  }

  const hooks = config.hooks
  // scan and execute fractal hooks to overwrite our defaults
  Object.keys(hooks).forEach(type => {
    // get the type of hook 
    Object.keys(hooks[type]).forEach(hook => {
      // get hook name
      // engine must be first required to be able to use the new config
      if (hook === 'engine') {
        const customEngine = require(hooks[type][hook].key)(hooks[type][hook].cmd)
        fractal[type][hook](customEngine)
      } else {
        hooks[type][hook].forEach(val => {
          type === 'fractal' ? fractal[hook](val.key, val.cmd) : fractal[type][hook](val.key, val.cmd)
        })
      }
    })
  })
  console.error('found Fractal hooks in project!')
} catch (err) {
  console.error('no hooks found in project!', err)
}

/*
 * Configure the theme
 */

const mandelbrot = require('@frctl/mandelbrot')

// create a new instance with custom config options
const groundzeroTheme = mandelbrot(mandelbrotDefaults)

// specify a static directory to hold the theme override css
const mountPath = path.join(process.env.PROJECT_CWD, 'theme-overrides')

/*
 * Specify the static assets directory that contains the custom stylesheet.
 */

groundzeroTheme.addStatic(mountPath, 'theme-overrides')

/*
 * Specify a template directory to override any view templates
 */

groundzeroTheme.addLoadPath(mountPath + '/views')

/**
 * Set Fractal web-ui theme
 */

fractal.web.theme(groundzeroTheme)

/**
 * Set Fractal server
 */

fractal.web.set('server', fractalServerConfig)