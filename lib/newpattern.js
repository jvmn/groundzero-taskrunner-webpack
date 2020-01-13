const inquirer = require('inquirer')
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const projectPath = require(path.resolve(process.env.PWD + '/paths.config.js'))
const config = require(path.resolve(process.env.PROJECT_CWD + '/project.config.js'))

let type, filename, folder, projectPrefix, cssprefix, js, classname, outputDir

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
          name: "js",
          default: false,
          message: "will you need to use JS?"
        }
      ]).then(function (res, err) {
        if (err) {
          console.error(err)
          reject(err)
        }

        type = res.type
        projectPrefix = config.pattern.projectCssPrefix
        js = res.js

        folder = type === 'component' ? '/components/' : '/modules/' + res.moduletype + '/'
        filename = findShortName(res.moduletype) + res.name
        cssprefix = projectPrefix ? projectPrefix + type.charAt(0) + '-' : ''
        classname = cssprefix + filename

        // create mod type directory
        if (!fs.existsSync(projectPath.dev + folder)) {
          fs.mkdirSync(projectPath.dev + folder, '0777')
        }
        // create mod/cmp directory
        if (!fs.existsSync(projectPath.dev + folder + filename)){
          fs.mkdirSync(projectPath.dev + folder + filename, '0777')
        } else {
          reject(folder + filename + ' already exists !!!')
        }
    
        outputDir = projectPath.dev + folder + filename + '/'
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
  return new Promise(function (resolve, reject) {
    try {
      const inputFile = path.join(__dirname, 'templates/' + template)
      fs.readFile(inputFile, (err, file) => {
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

function saveFile(file, ext) {
  return new Promise(function (resolve, reject) {
    try {
      fs.writeFile(
        outputDir + filename + '.' + ext,
        file,
        'utf8',
        function (errWritingOptimized) {
          if (errWritingOptimized) reject(errWritingOptimized)
          console.log(filename + '.' + ext + ' generated successfully')
          resolve()
        }
      )   
    } catch (error) {
      reject(error)
    }
  })
}

async function renderTemplateExt(ext) {
  const data = {
    filename,
    classname
  }

  try {
    const file = await openTemplateFile('pattern.' + ext)
    const proccessTemplate = await template(file, data)
    saveFile(proccessTemplate, ext)
  } catch (error) {
    console.log('​catch -> error', error)
  }
}

async function renderScss() {
  const data = {
    filename,
    classname
  }

  try {
    const file = await openTemplateFile('pattern.module.scss')
    const proccessTemplate = await template(file, data)
    saveFile(proccessTemplate, 'module.scss')
  } catch (error) {
    console.log('​catch -> error', error)
  }
}

async function renderJs() {
  const data = {
    filename,
    js
  }

  try {
    const file = await openTemplateFile('pattern.js')
    const proccessTemplate = await template(file, data)
    saveFile(proccessTemplate, 'js')
  } catch (error) {
    console.log('​catch -> error', error)
  }
}

async function renderConfig() {
  const data = {
    filename
  }

  try {
    const file = await openTemplateFile('pattern.config.js')
    const proccessTemplate = await template(file, data)
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
    await Promise.all([
      renderTemplateExt(engine),
      renderScss(),
      renderConfig(),
      renderJs(),
    ])
  })()
} catch (e) {
  console.log(e)
}