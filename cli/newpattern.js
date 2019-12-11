#!/usr/bin/env node
'use strict'

const { spawn } = require('child_process')
const error = require('../lib/error')
console.log("running newpattern")
// we expose the project path to correctly use it within the tasks 
process.env.PROJECT_CWD = process.env.PWD

const child = spawn('npm explore @jvmn/groundzero-taskrunner-webpack -- npm run newpattern', {
  stdio: 'inherit',
  env: process.env,
  shell: true
})

child.on('error', err => {
  error(`CLI Newpattern -> ${err}`, true)
})

if (child.stdin) {
  process.stdin.pipe(child.stdin)
}

if (child.stdout) {
  child.stdout.on('data', (data) => {
    console.log(`child stdout:\n${data}`)
  })
}
