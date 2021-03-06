const fs = require('fs')
const path = require('path')
const babel = require('rollup-plugin-babel')
const vue = require('rollup-plugin-vue')
const replace = require('rollup-plugin-replace')
const sass = require('node-sass')
const meta = require('../package.json')

const banner = `/*!
 * ${meta.name} v${meta.version}
 * ${meta.homepage}
 *
 * @license
 * Copyright (c) 2016 ${meta.author}
 * Released under the MIT license
 * ${meta.homepage}/blob/master/LICENSE
 */`

const moduleName = 'VueRangeSlider'

const plugins = [
  vue({
    compileTemplate: true,
    css: !process.env.NODE_ENV && (styles => {
      const out = path.resolve(__dirname, '../dist/vue-range-slider.css')
      sass.render({
        data: styles,
        outputStyle: 'expanded',
        outFile: out
      }, (error, result) => {
        if (error) {
          console.error(formatSassError(error))
          return
        }
        fs.writeFile(out, result.css)
      })
    })
  }),
  babel({
    exclude: 'node_modules/**'
  })
]
if (process.env.NODE_ENV) {
  plugins.push(
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  )
}

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  useStrict: false,
  plugins,
  moduleName,
  banner
}

function formatSassError(e) {
  return `[${e.line}:${e.column}] ${e.message} (${e.file})`
}
