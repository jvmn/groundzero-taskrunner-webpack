const path = require('path')
const projectPath = require(path.resolve(process.env.PWD + '/paths.config.js'))
const fs = require('fs-extra')
const minimist = require('minimist')
const args = minimist(process.argv.slice(2))
const assetsPath = projectPath.dev + '/assets/'
const dest = args.release ? projectPath.release + '/assets/' : projectPath.webui + '/assets/'

/**
 * Copy assets directory from src/assets
 */

try {
  (async () => {
    await fs.ensureDir(dest)
    await fs.copy(assetsPath, dest, {
      filter: function (filepath) {
        // ignore js folder that complies via webpack
        if (filepath.endsWith('.js')) return false
        return true
      }
    })
    console.log(`copied assets from ${assetsPath} to ${dest}`)
  })()
} catch (err) {
  console.error(err)
  throw err
}
