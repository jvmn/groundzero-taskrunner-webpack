const path = require('path')
const projectPath = require(path.resolve(process.env.PWD + '/paths.config.js'))
const imagemin = require('imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
const imageminSvgo = require('imagemin-svgo')
const globby = require('globby')

/**
 * List of input files
 */
const ASSETS = projectPath.webui + '/assets/img/**/*.@(jpg|jpeg|png|svg)'
const SPRITE_ICONS = projectPath.webui + '/assets/img/sprite-icons'

/**
 * Imagemin Options
 *
 * @see https://github.com/imagemin/imagemin
 */
const options = {
  /**
     * JPEG compression plugin options
     *
     * @see https://github.com/imagemin/imagemin-mozjpeg
     */
  mozjpegOptions: {
    progressive: true,
    quality: 90
  },
  /**
     * PNG compression plugin options
     *
     * @see https://github.com/imagemin/imagemin-pngquant
     */
  pngquantOptions: {
    quality: [0.8, 0.8]
  },
  /**
     * SVG compression plugin
     *
     * @see https://github.com/imagemin/imagemin-svgo
     */
  svgoOptions: {
    removeViewBox: true
  },
  /**
     * GIF compression plugin options
     *
     * @see https://github.com/imagemin/imagemin-gifsicle
     */
  gifOptions: {
    optimizationLevel: 3
  }
}


try {
  console.log('Beginning image compression...');

  (async () => {
    const inputPaths = await globby([ASSETS, '!' + SPRITE_ICONS])
    console.log('inputPaths', inputPaths)

    /**
         * Loop through all files, and recursively run imagemin,
         */
    for (let i in inputPaths) {
      const dir = inputPaths[i]
      const outputFolder = dir.replace(/[^/]+$/, '') // we remove the file name to get the output folder

      await imagemin([dir], outputFolder, {
        plugins: [
          imageminMozjpeg(options['mozjpegOptions']),
          imageminPngquant(),
          imageminSvgo(options['svgoOptions'])
        ]
      })
      console.log(`...${(((+i + 1) / inputPaths.length) * 100).toFixed(0)}%`)
    }

    console.log('Finished compressing all images!')
  })()
} catch (e) {
  console.log(e)
}