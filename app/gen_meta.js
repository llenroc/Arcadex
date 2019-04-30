const path = require('path')
const fs = require('fs')

const DIST_DIR = path.resolve(__dirname, 'dist')
const BUILD_DIR = path.resolve(__dirname, '..', 'dist')
const CONFIG_DIR = path.resolve(BUILD_DIR, 'config')

const config = require(path.resolve(CONFIG_DIR, 'config.json'))
const assets = require('./webpack-assets.json')
const siteURL = require('../site')

const urlRe = /^assets\/721metadata_img-([^_]*)_.*$/
const pngMap = assets[''].png.reduce((m, url) => {
  let result = url.match(urlRe)
  if (!result) {
    return m
  }
  m[result[1]] = url
  return m
}, {})

const nameRe = /^(Deku)?(.*)$/
const configMap = Object.keys(config).reduce((m, k) => {
  if (k === 'SlotMachine' || k === 'DekuFamily' || k === 'DekuCareer') {
    return m
  }
  if (k === 'DekuSan') {
    m[k] = k.toLowerCase()
    return m
  }
  m[k] = k.match(nameRe)[2].toLowerCase()
  return m
}, {})

Object.entries(configMap).forEach(([k, v]) => {
  let data = {
    name: k,
    description: `The token of ${k}.`,
    image: `${siteURL}/${pngMap[v]}`,
  }
  console.log(k, data)
  fs.writeFileSync(
    path.resolve(DIST_DIR, `${k}.json`),
    JSON.stringify(data)
  )
})
