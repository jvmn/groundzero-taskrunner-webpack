const { exec } = require('child_process')
exec('npm install @jvmn/groundzero-taskrunner-webpack@latest --save-dev', (error) => {
  if (error) {
    console.error(`could not update to the latest version: ${error}`)
    return
  }
  console.log(`Taskrunner updated successfully.`)
})

module.exports = () => {
  console.log(`Updating Taskrunner to latest version`)
}