const inquirer = require('inquirer')
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const projectPath = require(path.resolve(process.env.PWD + '/paths.config.js'))
const config = require(path.resolve(process.env.PROJECT_CWD + '/project.config.js'))

const templateVars = {
  js: false,
  cssinjs: false,
  scss: true,
  readme: true,
  type: null,
  filename: null,
  folder: null,
  projectPrefix: null,
  cssprefix: null,
  classname: null,
  outputDir: null,
  usingLocal: false
}

/** TODO: allow for non cssmod pattern */

const findShortName = function (type) {
  const obj = config.pattern.types.find((item) => item.value === type)
  return obj ? obj.short : ''
}

function newpatternVars () {
  return new Promise(function (resolve, reject) {
    try {
      inquirer.prompt([
        {
          type: "list",
          name: "type",
          message: "Is it a new component or a new module?",
          choices: ["component", "module"]
        },
        {
          type: "list",
          name: "moduletype",
          message: "What type of module?",
          choices: config.pattern.types,
          when: function(answers) {
            return answers.type === 'module'
          },
          filter: function (answer) {
            return answer
          }
        },
        {
          type: "input",
          name: "name",
          message: "insert name (case sensetive) of component/module (e.g. Tabs or TabsExtra)"
        },
        {
          type: "confirm",
          name: "scss",
          default: true,
          message: "will you need a scss file?"
        },
        {
          type: "confirm",
          name: "js",
          default: false,
          message: "will you need to use JS?"
        },
        {
          type: "confirm",
          name: "cssinjs",
          default: false,
          when: function (answers) {
            return answers.scss
          },
          message: "will you use CSS in JS in production?"
        },
        {
          type: "confirm",
          name: "readme",
          default: true,
          message: "generate a readme file?"
        },
      ]).then(function (res, err) {
        if (err) {
          console.error(err)
          reject(err)
        }

        templateVars.type = res.type
        templateVars.projectPrefix = config.pattern.projectCssPrefix
        templateVars.js = res.js
        templateVars.cssinjs = res.cssinjs
        templateVars.scss = res.scss
        templateVars.readme = res.readme

        templateVars.folder = templateVars.type === 'component' ? '/components/' : '/modules/' + res.moduletype + '/'
        templateVars.filename = findShortName(res.moduletype) + res.name
        templateVars.cssprefix = templateVars.projectPrefix ? templateVars.projectPrefix + templateVars.type.charAt(0) + '-' : ''
        templateVars.classname = templateVars.cssprefix + templateVars.filename

        // create mod type directory
        if (!fs.existsSync(projectPath.dev + templateVars.folder)) {
          fs.mkdirSync(projectPath.dev + templateVars.folder, '0777')
        }
        // create mod/cmp directory
        if (!fs.existsSync(projectPath.dev + templateVars.folder + templateVars.filename)){
          fs.mkdirSync(projectPath.dev + templateVars.folder + templateVars.filename, '0777')
        } else {
          reject(templateVars.folder + templateVars.filename + ' already exists !!!')
        }
    
        templateVars.outputDir = projectPath.dev + templateVars.folder + templateVars.filename + '/'
        resolve()
      })
    } catch (error) {
      reject(error)
    }
  })
}

function template (file, data) {
  return new Promise(function (resolve, reject) {
    try {
      const tpl = _.template(file.toString())
      const output = Buffer.from(tpl(_.merge({}, file, data)))
      resolve(output)
    } catch (err) {
      console.error(err)
      reject(err)
    }
  })    
}

function openTemplateFile(template) {
  let inputFilePath = path.join(__dirname, 'templates/' + template)
  // First look if template exists in /newpattern/ folder otherwise use taskrunner defaults
  try {
    fs.accessSync(`${ process.env.PROJECT_CWD }/newpattern/${ template }`, fs.constants.R_OK | fs.constants.W_OK)
    inputFilePath = `${ process.env.PROJECT_CWD }/newpattern/${ template }`
    templateVars.usingLocal = true
  } catch (err) {
    templateVars.usingLocal = false
  }
  return new Promise(function (resolve, reject) {
    try {
      fs.readFile(inputFilePath, (err, file) => {
        if (err) {
          console.error(err)
          reject(err)
        }
        resolve(file)
      })
    } catch (error) {
      reject(error)
    }
  })
}

function saveFile(file, ext, name = templateVars.filename) {
  return new Promise(function (resolve, reject) {
    try {
      fs.writeFile(
        `${templateVars.outputDir}${name}.${ext}`,
        file,
        'utf8',
        function (errWritingOptimized) {
          if (errWritingOptimized) reject(errWritingOptimized)
          const templateInfo = templateVars.usingLocal ? '✳️  local' : '⚛︎  Taskrunner'
          console.log(`${name}.${ext} generated successfully using ${templateInfo} template`)
          resolve()
        }
      )   
    } catch (error) {
      reject(error)
    }
  })
}

async function renderTemplate() {
  const ext = config.pattern.engineExt || 'hbs'
  try {
    const file = await openTemplateFile('pattern.' + ext)
    const proccessTemplate = await template(file, templateVars)
    saveFile(proccessTemplate, ext)
  } catch (error) {
    console.log('​catch -> error', error)
  }
}

async function renderScss() {
  try {
    const file = await openTemplateFile('pattern.module.scss')
    const proccessTemplate = await template(file, templateVars)
    saveFile(proccessTemplate, 'module.scss')
  } catch (error) {
    console.log('​catch -> error', error)
  }
}

async function renderJs() {
  try {
    const file = await openTemplateFile('pattern.js')
    const proccessTemplate = await template(file, templateVars)
    saveFile(proccessTemplate, 'js')
  } catch (error) {
    console.log('​catch -> error', error)
  }
}

async function renderMd() {
  try {
    const file = await openTemplateFile('README.md')
    const proccessTemplate = await template(file, templateVars)
    saveFile(proccessTemplate, 'md', 'README')
  } catch (error) {
    console.log('​catch -> error', error)
  }
}

async function renderConfig() {
  try {
    const file = await openTemplateFile('pattern.config.js')
    const proccessTemplate = await template(file, templateVars)
    saveFile(proccessTemplate, 'config.js')
  } catch (error) {
    console.log(error)
  }
}

try {
  (async () => {
    const engine = config.pattern.engineExt || 'hbs'
    console.log(`Generating ${engine} pattern...`)
    await newpatternVars()
    await renderTemplate()
    await renderConfig()

    if (templateVars.js || templateVars.scss) await renderJs()
    if (templateVars.scss) await renderScss()
    if (templateVars.readme) await renderMd()
  })()
} catch (e) {
  console.log(e)
}