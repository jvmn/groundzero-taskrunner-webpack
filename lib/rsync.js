const gitRev = require('git-rev')
const upload = require('@jvmn/upload-rsync')
const path = require('path')
const config = require(path.resolve(process.env.PROJECT_CWD + '/deploy-access.js'))
const minimist = require('minimist')
const args = minimist(process.argv.slice(2))

let env = args.stage === true ? 'stage' : 'dev'
let destFolder = ""
let settings = {
  host: config.host[env],
  destFolder: config.folder[env],
  prefix: config.prefix[env],
  user: config.ssh.username,
  password: config.ssh.password,
}

/*
 * Custom rsync script
 */
function upload_rsync(user, host, folder) {
  return new Promise(function (resolve, reject) {
    try{
      const cmd = new upload.cmd({})
      let dest = user + '@' + host + ':' + folder
      console.log('upload_rsync - dest', dest)
      const config = new upload.config(cmd)
        .setConfig({
          dest: dest,
          src: [process.env.PROJECT_CWD +'/build'],
          logfile: process.env.PROJECT_CWD + '/rsync.log',
          delete: false
        })
        .init()
    
      new upload.rsync(config)
        .init()
        .setup()
        .run(() => {
          resolve()
        })
            
            
    } catch (err) {
      console.log(err.stack)
      reject(err)
    }
  })
}

/*
 * Deploy script
 * accepting 2 args:
 * --stage: for deploying to stage enviorment
 * --all: for deploying to both dev and stage enviorments
 * --feature: for deploying a feature brance, also accepts the --all argument
 */
if (!args.feature) {
  destFolder = settings.prefix + settings.destFolder
  upload_rsync(settings.user, settings.host, destFolder).then(() => {
    console.log(config.url[env] + 'build')
        
    if (args.all) {
      env = "stage"
      upload_rsync(settings.user, settings.host, destFolder).then(() => {
        console.log(`
Quick Links
DEV
---
${config.url['dev']}build
-----
STAGE
-----
${config.url['stage']}build
                `)
      })
    }
  })
} else {
  // Get branch name, afer doing so, deploy.
  gitRev.branch(function (branch) {
    // since rsync can't create nested folders we have to flatten the url to: feature_feature-name
    branch = branch.replace("/", "_")
    destFolder = settings.prefix + settings.destFolder + '/' + branch
    return upload_rsync(settings.user, settings.host, destFolder).then(() => {
      console.log(config.url[env] + branch + '/build')
            
      if (args.all) {
        env = "stage"
        upload_rsync(settings.user, settings.host, destFolder).then(() => {
          console.log(`
Quick Links
DEV
---
${config.url['dev'] + branch}/build
-----
STAGE
-----
${config.url['stage'] + branch}/build
                    `)
        })
      }
    })
  })
}