# translator-cli
> The command line app for translate

## Install

```bash
$ npm install -g translator-cli
```

## Features

- translates words, phrases between English and Chinese
- easy and fast switch between different API (e.g. youdao、iciba)

## Usage

```bash
$ translator

  Usage: translator [options] [command]

  Options:

    -V, --version  output the version number
    -h, --help     output usage information

  Commands:

    query <words>  Query words
    ls             List all the source
    use            Change source to source
```

## Examples
```bash
$ translator query test
test  [ test ]    ~ fanyi.youdao.com

- n. 试验；检验
- vt. 试验；测试
- vi. 试验；测试
- n. (Test)人名；(英)特斯特

1. Test
   测试,测验,检验
2. Test Drive
   Test Drive,Test Drive,无限狂飙
3. Test Engineer
   测试员,测试工程师,软件测试工程师
```

## LICENSE
[MIT](https://github.com/liuxing/translator-cli/blob/master/LICENSE) @ Liu Xing
