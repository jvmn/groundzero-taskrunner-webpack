const inquirer = require('inquirer')
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const projectPath = require(path.resolve(process.env.PWD + '/paths.config.js'))
const config = require(path.resolve(process.env.PROJECT_CWD + '/project.config.js'))

let type, folder, prefix, label, name, js, jsinit, outputDir, camelcase, namePrefix

const toCamelCase = function (str) {
  return str.replace(/^([A-Z])|[\s-_]+(\w)/g, function(match, p1, p2) {
    if (p2) return p2.toUpperCase()
    return p1.toLowerCase()
  })
}

const getShortName = function (val) {
  let text = val.split('-')
  let splitText = text.map((word) => word.charAt(0))
  return splitText.join('')
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
          message: "insert name of component/module (e.g. tabs or tabs-extra)"
        },
        {
          type: "confirm",
          name: "js",
          default: true,
          message: "Add JS template?"
        }
      ]).then(function (res, err) {
        if (err) {
          console.error(err)
          reject(err)
        }
    
        type = res.type
        js = res.js

        if (type === 'component') {
          folder = '/components/'
          prefix = 'cmp-'
          camelcase = toCamelCase(prefix + res.name)
          label = res.name
          name = prefix + res.name
          jsinit = js ? 'data-jsinit="' + camelcase + '"' : ''
        } else if (type === 'module') {
          folder = '/modules/' + res.moduletype + '/'
          prefix = 'mod-'
          namePrefix = getShortName(res.moduletype)
          // moduleType = res.moduletype.toLowerCase()
          camelcase = toCamelCase(prefix + namePrefix + '-' +  res.name)
          label = namePrefix + '-' + res.name
          name = prefix + namePrefix + '-' + res.name
          jsinit = js ? 'data-jsinit="' + camelcase + '"' : ''
        }
        // create mod type directory
        if (!fs.existsSync(projectPath.dev + folder)) {
          fs.mkdirSync(projectPath.dev + folder, '0777')
        }
        // create mod/cmp directory
        if (!fs.existsSync(projectPath.dev + folder + name)){
          fs.mkdirSync(projectPath.dev + folder + name, '0777')
        } else {
          reject(folder + name + ' already exists !!!')
        }
    
        outputDir = projectPath.dev + folder + name + '/'
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
        outputDir + name + '.' + ext,
        file,
        'utf8',
        function (errWritingOptimized) {
          if (errWritingOptimized) reject(errWritingOptimized)
          console.log(name + '.' + ext + ' generated successfully')
          resolve()
        }
      )   
    } catch (error) {
      reject(error)
    }
  })
}

async function renderHbs() {
  const data = {
    title: name,
    patternname: name,
    patternprefix: prefix,
    jsinit: jsinit
  }

  try {
    const file = await openTemplateFile('pattern.hbs')
    const proccessTemplate = await template(file, data)
    saveFile(proccessTemplate, 'hbs')
  } catch (error) {
    console.log('​catch -> error', error)
  }
}

async function renderScss() {
  const data = {
    title: name,
    patternname: name,
    patternprefix: prefix
  }

  try {
    const file = await openTemplateFile('pattern.scss')
    const proccessTemplate = await template(file, data)
    saveFile(proccessTemplate, 'scss')
  } catch (error) {
    console.log('​catch -> error', error)
  }
}

async function renderJs() {
  if (!js) return
    
  const data = {
    title: name,
    patternname: name,
    patternprefix: prefix.slice(0, -1),
    camelcase: camelcase
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
    label: label,
    title: name
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
  console.log('Beginning newpattern...');

  (async () => {
    await newpatternVars()
    await Promise.all([
      renderHbs(),
      renderScss(),
      renderConfig(),
      renderJs(),
    ])
  })()
} catch (e) {
  console.log(e)
}