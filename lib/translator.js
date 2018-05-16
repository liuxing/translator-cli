const request = require('superagent')
const xml2js = require('xml2js')
const chalk = require('chalk')
const Configstore = require('configstore')
const { URL } = require('url')
const log = console.log
const api = require('./api.json')
const pkg = require('../package.json')
const conf = new Configstore(pkg.name)

exports.onList = function () {
  let current = getCurrentApi()
  for (let key in api) {
    if (key === current) {
      log(chalk.blue('*  ' + key + '  -> ' + new URL(api[key]).origin))
    } else {
      log('   ' + key + '  -> ' + new URL(api[key]).origin)
    }
  }
}

exports.onUse = function (source) {
  setCurrentApi(source)
}

exports.query = async function (query) {
  let current = getCurrentApi()
  let source = api[current]
  if (current === 'youdao') {
    const data = await request.get(source).query({ q: query })
    const result = data.body
    parseYoudao(result)
  } else if (current === 'iciba') {
    const data = await request.get(source).query({ w: query })
    parseIciba(data.text)
  }
}

function getCurrentApi () {
  let source = conf.get('source')
  return source
}

function setCurrentApi (source) {
  conf.set('source', source)
  log(chalk.cyan(`source has been set to: ${source}`))
}

function parseYoudao (data) {
  let header = ''
  header += data.query
  if (data.basic && data.basic.phonetic) {
    header += chalk.magenta('  [ ' + data.basic.phonetic + ' ]')
  }
  log(header + chalk.gray('    ~ fanyi.youdao.com'))
  // explains
  if (data.basic && data.basic.explains) {
    log()
    data.basic.explains.forEach((item) => {
      log(chalk.gray('- ') + chalk.green(item))
    })
  }
  // sentence
  if (data.web && data.web.length) {
    log()
    data.web.forEach((item, i) => {
      log(chalk.gray(i + 1 + '. ') + item.key)
      log(`     ${chalk.cyan(item.value.join(','))}\n`)
    })
  }
}

async function parseIciba (data) {
  const _data = await parseString(data)
  data = _data.dict
  let header = ''
  header += data.key + ' '

  if (typeof data.ps === 'string') {
    data.ps = [data.ps]
  }
  if (typeof data.pos === 'string') {
    data.pos = [data.pos]
  }
  if (typeof data.acceptation === 'string') {
    data.acceptation = [data.acceptation]
  }

  if (data.ps && data.ps.length) {
    var ps = ''
    data.ps.forEach((item, i) => {
      header += chalk.magenta(' ' + (i === 0 ? '英' : '美') + '[ ' + item + ' ] ')
    })
    header += ps
  }

  log(header + chalk.gray('    ~ iciba.com'))

  if (data.pos && data.pos.length) {
    log()
    data.pos.forEach((item, i) => {
      if (typeof data.pos[i] !== 'string' || !data.pos[i]) {
        return
      }
      log(chalk.gray('- ') + chalk.green(data.pos[i] + ' ' + data.acceptation[i].trim()))
    })
  }

  if (data.sent && data.sent.length) {
    log()
    data.sent.forEach((item, i) => {
      if (typeof item.orig !== 'string' && item.orig[0]) {
        item.orig = item.orig[0].trim()
      }
      if (typeof item.trans !== 'string' && item.trans[0]) {
        item.trans = item.trans[0].trim()
      }
      log(chalk.gray(i + 1 + '. ') + item.orig)
      log(`   ${chalk.cyan(item.trans)}\n`)
    })
  }
}

function parseString (xml) {
  return new Promise(function (resolve, reject) {
    xml2js.parseString(xml, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}
