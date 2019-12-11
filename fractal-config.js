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

/**
 * Prevent Bluebird warnings like "a promise was created in a handler but was not returned from it"
 * caused by Nunjucks from polluting the console
 */
bluebird.config({
  warnings: false
})

/*
 * Configure a Fractal instance.
 *
 * This configuration could also be done in a separate file, provided that this file
 * then imported the configured fractal instance from it to work with in your Gulp tasks.
 * i.e. const fractal = require('./my-fractal-config-file');
 */

/*
* Give your project meta data.
*/
fractal.set('project.title', config.fractal.title)
fractal.set('project.info', config.fractal.info)
fractal.set('project.url', config.fractal.url)
fractal.set('project.version', packageJson.version)
fractal.set('project.author', 'Jung von Matt/Neckar')
fractal.set('project.buildDate', new Date())
fractal.set('project.namespace', 'AP_')
fractal.set('project.gitrepo', config.fractal.gitrepo)

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
 * Fractal server config
 */

fractal.web.set('server', {
  sync: true,
  port: 3000,
  watch: true,
  logLevel: 'debug',
  syncOptions: {
    open: 'local', // the browser
    // browser: ['google chrome'],
    notify: true,
    watchOptions: {
      ignored: ['/**/*.scss'],
      ignoreInitial: true,
      files: [],
    }
  }
})

/**
 * set title of pattern lib in the web view navigation bar (doesn't need to be changed)
 */
fractal.components.set('title', 'Patterns')
fractal.components.set('label', 'Patterns')

/**
 * set theme configs
 */

// create a new instance with custom config options
const groundzeroTheme = require('@frctl/mandelbrot')({
  skin: "white",
  styles: ['default', '/theme-overrides/assets/css/theme-overrides.css'],
  scripts: [
    "/theme-overrides/assets/js/polyfills.min.js",
    "default",
  ]
})

// specify a static directory to hold the theme override css
const dir = path.join(process.env.PROJECT_CWD, 'theme-overrides')
const mount = 'theme-overrides'
groundzeroTheme.addStatic(dir, mount)

fractal.web.theme(groundzeroTheme)

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

// check if we have a fractal.hooks in project root
try {
  fs.accessSync(`${process.env.PROJECT_CWD}/fractal.hooks.js`, fs.constants.R_OK | fs.constants.W_OK)
  const hooks = require(`${process.env.PROJECT_CWD}/fractal.hooks.js`).hooks
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
  console.error('found hooks in project!')
} catch (err) {
  console.error('no hooks found in project!', err)
}