#!/usr/bin/env node
'use strict'

const minimist = require('minimist')
const error = require('./lib/error.js')
const criticalCss = require('./lib/critical-css.js').process
const args = minimist(process.argv.slice(2))

let cmd = args._[0] || 'help'

if (args.version || args.v) {
  cmd = 'version'
}

if (args.help || args.h) {
  cmd = 'help'
}

switch (cmd) {
case 'dev':
  require('./cli/dev.js')
  break

case 'build':
  require('./cli/build')
  break

case 'release':
  require('./cli/release')
  break

case 'deploy':
  require('./cli/deploy')
  break

case 'newpattern':
  require('./cli/newpattern')
  break

case 'version':
  require('./lib/version')(args)
  break

case 'update':
  require('./lib/update')
  break

case 'help':
  require('./lib/help')(args)
  break

case 'jest':
  require('./cli/jest.js')
  break

default:
  error(`"${cmd}" is not a valid command!`, true)
  break
}

module.exports = {
  criticalCss
}