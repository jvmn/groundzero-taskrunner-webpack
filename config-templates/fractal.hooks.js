'use strict'
/** 
 * here you can require whatever you need
 * listing below 3 examples and all the hooks avilable
 * the 'fractal' object will resolve into fractal.set('custom', 'custom').
 * not supported at the moment: builder, or addStatic
*/

module.exports = {
  hooks: {
    'components': {
      'engine': {
        key: '@frctl/handlebars',
        cmd: {
          helpers: {
            //key:value of function you want to extand the engine
          }
        }
      },
      'set': [
        {
          key: 'default.context',
          cmd: {
            'gblSpriteSheet': '../../assets/img/sprite-icons/AP_sprite.svg'
          }
        }
      ]
    },
    'web': {},
    'docs': {},
    'cli': {},
    'fractal': {
      'set': [
        {
          key: 'customVar',
          cmd: 'customValue'
        }
      ]
    }
  }
}
