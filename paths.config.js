// Export projects path alias
const srcFolderName = 'src'
module.exports = {
  'build': `${process.env.PROJECT_CWD}/build`,
  'dev': `${process.env.PROJECT_CWD}/${srcFolderName}`,
  'release': `${process.env.PROJECT_CWD}/release`,
  'cssmod': `${process.env.PROJECT_CWD}/release/assets/css/modules/temp`,
  'criticalDev': `${process.env.PROJECT_CWD}/web-ui/assets/css/critical/temp`,
  'criticalProd': `${process.env.PROJECT_CWD}/release/assets/css/critical/temp`,
  'webui': `${process.env.PROJECT_CWD}/web-ui`,
  'docs': `${process.env.PROJECT_CWD}/docs`,
  'webpackAlias': {
    'base': '',
    'dev': `${srcFolderName}/`,
    'glb': `${srcFolderName}/globals/`,
    'functions': `${srcFolderName}/globals/js/`,
    'objects': `${srcFolderName}/objects/`,
    'components': `${srcFolderName}/components/`,
    'modules': `${srcFolderName}/modules/`,
    'styleguide': `${srcFolderName}/styleguide/`
  }
}