#!/usr/bin/env node
'use strict'

const { spawn } = require('child_process')
const error = require('../lib/error')
console.log("running jest")
// we expose the project path to correctly use it within the tasks 
process.env.PROJECT_CWD = process.env.PWD

let options = ' --'
options += ' --projects ' + process.env.PROJECT_CWD

const child = spawn('npm explore @jvmn/groundzero-taskrunner-webpack -- npm run jest' + options, {
  stdio: 'inherit',
  env: process.env,
  shell: true
})

child.on('error', err => {
  error(`CLI Jest -> ${err}`, true)
})

if (child.stdin) {
  process.stdin.pipe(child.stdin)
}

if (child.stdout) {
  child.stdout.on('data', (data) => {
    console.log(`child stdout:\n${data}`)
  })
}
