const execa = require('execa')

test('Query words', async () => {
  const word = 'test'
  const ret = await execa('./bin/cli.js', ['query', word])
  expect(ret.stdout).toMatch(new RegExp(word))
})

test('Change source to source', async () => {
  const source = 'youdao'
  const ret = await execa('./bin/cli.js', ['use', source])
  expect(ret.stdout).toBe(`source has been set to: ${source}`)
})

test('List all the source', async () => {
  const ret = await execa('./bin/cli.js', ['ls'])
  expect(ret.stdout.replace('\n', '')).toMatch(/(?=.*youdao)(?=.*iciba)^.*$/)
})
