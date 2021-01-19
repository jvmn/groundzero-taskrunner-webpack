const menus = {
  main: `
        groundzero [command] <options>

        dev ................ start fractal on dev mode
        build .............. build fractal standalone for deploying
        release ............ build a release
        export ............. run a static HTML export of Fractal components, modules and pages
        deploy ............. build & deploy fractal via ssh
        rsync .............  deploy fractal via ssh
        newpattern ......... new moudle / component boilerplate
        version ............ show package version
        update ............. update taskrunner to latest version
        help ............... show help menu for a command`,

  deploy: `
        groundzero deploy <options>
        
        --stage ....... build + deploy to stage enviorment,
        --all ......... build + deploy to dev and stage enviorment,
        --feature ..... build + deploy a feature brance, can be combined with an env flag`,
  rsync: `
        groundzero rsync <options>
        
        --stage ....... deploy to stage enviorment,
        --all ......... deploy to dev and stage enviorment,
        --feature ..... deploy a feature brance, can be combined with an env flag`,
}

module.exports = (args) => {
  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._[0]

  console.log(menus[subCmd] || menus.main)
}