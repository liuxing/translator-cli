#! /usr/bin/env node

const program = require('commander')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')
const translator = require('../lib/translator')

updateNotifier({ pkg }).notify()

program
  .version(pkg.version)

program
  .command('query <words>')
  .description('Query words')
  .action(translator.query)

program
  .command('ls')
  .description('List all the source')
  .action(translator.onList)

program
  .command('use')
  .description('Change source to source')
  .action(translator.onUse)

program.parse(process.argv)

if (process.argv.length === 2) {
  program.outputHelp()
}
