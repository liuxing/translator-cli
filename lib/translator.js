const request = require('superagent')
const chalk = require('chalk')
const log = console.log
const api = require('./api.json')

exports.query = function (query) {
  request
    .get(api['youdao'])
    .query({ q: query })
    .then(function (res) {
      const data = res.body
      parseYoudao(data)
    })
    .catch(function (err) {
      console.error(err)
    })
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
      log('   ' + chalk.cyan(item.value.join(',')))
    })
  }
}
