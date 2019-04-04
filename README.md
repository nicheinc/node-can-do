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

First, specify the version of Node and version of npm that you would like to enforce for your project in the project's `package.json`, specifically in the [`engines`](https://docs.npmjs.com/files/package.json#engines) section:

```json
"engines": {
  "node": "10.15.3",
  "npm": "6.9.0"    
},
```

Make sure to only use a specific value, no version ranges.

In addition/instead of `package.json`, you can specify the version of Node you would like to enforce in an [`.nvmrc`](https://github.com/creationix/nvm#nvmrc) file.

```
10.15.3
```

Next, we recommend using `node-can-do` in conjunction with [`npm scripts`](https://docs.npmjs.com/misc/script) in `package.json`, e.g.

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
},
```

Finally, run

```sh
npm run myscript
```

If you are running the versions of Node and npm that are specified in `package.json` or `.nvmrc`, then your script should continue as normal 🎉.

If you are running a different version of Node and/or npm, `node-can-do` will produce terminal output informing you to change your version of the incorrect tool, and then stop script execution with an exit code 1 🛑.

If there is no specified version of Node and/or npm, `node-can-do` will produce terminal output informing you to add your required versions in one of the locations specified in [Usage](https://github.com/nicheinc/node-can-do/#usage), and then stop script execution with an exit code 1 🛑.

## Issues

Feel free to file issues at https://github.com/nicheinc/node-can-do/issues/new
