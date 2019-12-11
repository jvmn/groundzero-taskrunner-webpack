const path = require('path')
const globby = require('globby')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const packageJson = require(path.resolve(process.env.PROJECT_CWD + '/package.json'))
const projectPath = require(path.resolve(process.env.PWD + '/paths.config.js'))
const srcPath = path.join(process.env.PROJECT_CWD, './src')

const criticalEntries = () => globby.sync(srcPath + '/**/*.critical.scss').reduce((modules, path) => {
  const name = path.split('\\').pop().split('/').pop().replace('.critical.scss', '')
  modules[name] = path
  return modules
}, {})

const aliasEntries = () => {
  const aliases = projectPath.webpackAlias
  const paths = {}
  for (const key in aliases) {
    paths[key] = path.resolve(process.env.PROJECT_CWD, aliases[key])
  }
  return paths
}
/**
 * Resources for lazy loading:
 * https://medium.com/front-end-hacking/webpack-and-dynamic-imports-doing-it-right-72549ff49234
 * https://webpack.js.org/guides/public-path/
 */

module.exports = {
  context: srcPath,
  mode: 'production',
  entry: {
    ...criticalEntries(),
  },
  output: {
    path: process.env.MODE === 'production' ? projectPath.criticalProd : projectPath.criticalDev,
    chunkFilename: '[name].js',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.scss'],
    alias: { ...aliasEntries() }
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCssAssetsPlugin({})],
  },
  plugins: [
    new CleanWebpackPlugin({
      // clean web-ui output folder before watch and build
      cleanAfterEveryBuildPatterns: ['*']
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: false } }],
      },
      canPrint: true
    }),
    new MiniCssExtractPlugin({
      filename: '../[name].css',
      chunkFilename: '../[name].css'
    })
  ],
  module: {
    rules: [
      // handle critical css
      {
        test: /\.critical\.scss$/,
        loader: [
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: {
              modules: false,
              sourceMap: true
            }
          },
          // Add autoprefixer to css
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('autoprefixer')(),
              ]
            }
          },
          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
            options: {
              sassOptions: () => {
                // we include the src (/src/assets) path as our base url for file imports in the scss files
                // any url() imports in the css should be set relative to the assets folder  
                return {
                  includePaths: [srcPath + '/']
                }
              },
              prependData: () => {
                // Inject package version
                const versionString = '/*! @preserve: Version: '+packageJson.version+', Build date: '+ new Date().toISOString() + ' */\n\n'
                return `${versionString}`
              },
              sourceMap: true
            }
          },
        ]
      },
    ]
  },
  stats: {
    // assets: false,
    excludeAssets: (assetName) => assetName.includes('js'),
    modules: false,
    chunks: false,
    cached: false,
    cachedAssets: false,
    entrypoints: false,
    hash: false,
    children: false,
    reasons: false,
    version: false,
    outputPath: false,
    chunkOrigins: false,
    colors: true
  },
}
