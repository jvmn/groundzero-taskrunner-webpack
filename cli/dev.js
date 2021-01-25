#!/usr/bin/env node
'use strict'

const { spawn } = require('child_process')
const fs = require('fs')
const error = require('../lib/error')
// expose project root folder varialbe to load configs in npm
process.env.PROJECT_CWD = process.env.PWD

// check if we have a webpack.dev config in project root
try {
  fs.accessSync(`${ process.env.PROJECT_CWD }/webpack.dev.js`, fs.constants.R_OK | fs.constants.W_OK)
  process.env.WEBPACK_DEV_CONFIG = `${process.env.PROJECT_CWD}/webpack.dev.js`
  console.log('✳️  using local webpack.dev config')
} catch (err) {
  console.log('⚛︎  using Taskrunner webpack.dev config!')
  process.env.WEBPACK_DEV_CONFIG = `./webpack.dev.js`
}
// check if we have a webpack.critical config in project root
try {
  fs.accessSync(`${ process.env.PROJECT_CWD }/webpack.critical.js`, fs.constants.R_OK | fs.constants.W_OK)
  process.env.WEBPACK_CRITICAL_CONFIG = `${process.env.PROJECT_CWD}/webpack.critical.js`
  console.log('✳️  using local webpack.critical config !')
} catch (err) {
  console.log('⚛︎  using Taskrunner webpack.critical config!')
  process.env.WEBPACK_CRITICAL_CONFIG = `./webpack.critical.js`
}
// check if we have a svg-sprite config in project root
try {
  fs.accessSync(`${ process.env.PROJECT_CWD }/svg-sprite.config.json`, fs.constants.R_OK | fs.constants.W_OK)
  process.env.SPRITE_CONFIG = `${process.env.PROJECT_CWD}/svg-sprite.config.json`
  console.log('✳️  using local svg-sprite.config !')
} catch (err) {
  console.log('⚛︎  using Taskrunner svg-sprite.config !')
  process.env.SPRITE_CONFIG = `./svg-sprite.config.json`
}

const child = spawn('npm explore @jvmn/groundzero-taskrunner-webpack -- npm run dev', {
  stdio: 'inherit',
  env: process.env,
  shell: true
})

child.on('error', err => {
  error(`CLI Dev -> ${err}`, true)
})

if (child.stdin) {
  process.stdin.pipe(child.stdin)
}

if (child.stderr) {
  process.stderr.pipe(child.stderr)
}

if (child.stdout) {
  child.stdout.on('data', (data) => {
    console.log(`child stdout:\n${data}`)
  })
}
