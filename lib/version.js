const { version } = require('../package.json')

const { exec } = require('child_process')
exec('npm view @jvmn/groundzero-taskrunner-webpack version  ', (error, stdout) => {
  if (error) {
    console.error(`could not get the latest version: ${error}`)
    return
  }
  console.log(`latest:    v${stdout}`)
})

module.exports = () => {
  console.log(`installed: v${version}`)
}