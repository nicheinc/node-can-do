# node-can-do 
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/nicheinc/node-can-do/blob/master/LICENSE.md) [![npm version](https://img.shields.io/npm/v/node-can-do.svg?style=flat)](https://www.npmjs.com/package/node-can-do)

`node-can-do` is a CLI tool for enforcing a project's Node/npm versions with Hall & Oates lyrics.  

![Daryl Hall singing "I Can't Go For That"](https://media.giphy.com/media/3ohjV3KahwmqwPwQLu/giphy.gif)

## Installation

To install for usage in a specific project, run the following:

```sh
npm install --save-dev node-can-do
```

## Usage

We recommend using `node-can-do` in conjunction with [`npm scripts`](https://docs.npmjs.com/misc/script) in `package.json`, e.g.

```json
"scripts": {
  "myscript": "node-can-do && node ./index.js"
},
```

Or preferably using the [`pre` script hook](https://docs.npmjs.com/misc/scripts#description), e.g.

```json
"scripts": {
  "premyscript": "node-can-do",
  "myscript": "node ./index.js"
}
```

## Issues

Feel free to file issues at https://github.com/nicheinc/node-can-do/issues/new
