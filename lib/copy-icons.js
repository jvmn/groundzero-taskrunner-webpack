const path = require('path')
const projectPath = require(path.resolve(process.env.PWD + '/paths.config.js'))
const fs = require('fs-extra')
const minimist = require('minimist')
const args = minimist(process.argv.slice(2))
const assetsPath = projectPath.dev + '/assets/img/sprite-icons/'
const dest = args.release ? projectPath.release + '/assets/img/sprite-icons/' : projectPath.webui + '/assets/img/sprite-icons/'

/**
 * Copy sprite icons directory from src/assets
 */

try {
  (async () => {
    await fs.ensureDir(dest)
    await fs.copy(assetsPath, dest)
    console.log(`copied sprite icons from ${assetsPath} to ${dest}`)
  })()
} catch (err) {
  console.error(err)
  throw err
}