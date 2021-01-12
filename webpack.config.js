const path = require('path')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const projectPath = require(path.resolve(process.env.PWD + '/paths.config.js'))
const packageJson = require(path.resolve(process.env.PROJECT_CWD + '/package.json'))
const srcPath = path.join(process.env.PROJECT_CWD, './src')
const distPath = path.join(process.env.PROJECT_CWD, './web-ui/assets/js')
let babelConfig

try {
  fs.accessSync(`${process.env.PROJECT_CWD}/babel.config.js`, fs.constants.R_OK | fs.constants.W_OK)
  babelConfig = `${process.env.PROJECT_CWD}/babel.config.js`
  console.error('use babel project config!')
} catch (err) {
  console.error('use babel package config!')
  babelConfig = `./babel.config.js`
}

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
  bail: true, // force webpack to exit on error
  entry: {
    app: './assets/js/app.js',
    global: './globals/style/style.global.scss',
    styleguide: './styleguide/style/styleguide.global.scss'
  },
  output: {
    path: distPath,
    chunkFilename: 'jvm-[name].js',
    filename: 'jvm-[name].js'
  },
  resolve: {
    extensions: ['.js', '.scss'],
    alias: {
      ...aliasEntries()
    }
  },
  plugins: [
    new CleanWebpackPlugin({
      // clean webui js folder before watch and build
      cleanAfterEveryBuildPatterns: ['*']
    }),
    new MiniCssExtractPlugin({
      // path is relative to the distPath, see prod path
      filename: '../css/[name].css',
      chunkFilename: '../css/[id].css'
    })
  ],
  module: {
    rules: [
      // handle modules css
      {
        // test: /\.s[ac]ss$/i,
        test: /\.module\.scss$/,
        use: [
          // Creates `style` nodes from JS strings
          {
            loader: 'style-loader',
            options: {
              esModule: false
            }
          },
          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: {
              esModule: false,
              modules: false,
              sourceMap: true
            }
          },
          // Add autoprefixer to css
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('autoprefixer')
                ]
              }
            }
          },
          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
            options: {
              additionalData: (content, loaderContext) => {
                // Inject global scss vars/mixins before each module
                const { rootContext } = loaderContext
                const injectPath = path.resolve(rootContext, './globals/style/_modules_inject')
                const versionString = '/*! @preserve: Version: '+packageJson.version+', Build date: '+ new Date().toISOString() + ' */\n\n'
                return `${versionString} @import "${injectPath}"; ${content}`
              },
              sourceMap: true
            }
          },
        ],
      },
      // handle global css
      {
        test: /\.global\.scss$/,
        loader: [
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: {
              esModule: false,
              url: false, // use relative urls to to the css folder
              modules: false,
              sourceMap: true
            }
          },
          // Add autoprefixer to css
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('autoprefixer')
                ]
              }
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
              additionalData: (content) => {
                // Inject package version
                const versionString = '/*! @preserve: Version: '+packageJson.version+', Build date: '+ new Date().toISOString() + ' */\n\n'
                return `${versionString} ${content}`
              },
              sourceMap: true
            }
          },
        ]
      },
      // handle js
      {
        test: /^(?!.*\.config\.js$).*\.js$/,
        exclude: /(node_modules)/,
        /* if you decide to bundle GSAP and not use the umd verion you would need to
         * use include instead of exclude to properly babelify GSAP or it fails on older browsers.
         */
        // include: [
        //     srcPath,
        //     /(node_modules\/gsap)/
        // ],
        use: {
          // https://github.com/babel/babel-loader
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env'],
            plugins: ['@babel/plugin-syntax-dynamic-import'],
            configFile: babelConfig
          }
        }
      }
    ]
  },

  /** Externals
   *  In case you want to include external plugins and they need dependencies that are part of the bundle.
   *  Useful for some GSAP plugins like DrawSVGPlugin which are not yet optimized for Webpack.
   **/
  // externals: {
  //     'TweenLite': 'TweenLite'
  // },
}
