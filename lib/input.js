// eslint-disable-next-line camelcase
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')
const process = require('process')

const cwd = process.cwd()
const packageJsonPath = path.join(cwd, '/package.json')
const packageJson = require(packageJsonPath)

function getNvmrcVersion() {
    const nvmrcPath = path.join(cwd, '/.nvmrc')

    return new Promise(resolve => {
        fs.readFile(nvmrcPath, 'utf8', (err, data) => {
            if (err) {
                return resolve('')
            }

            return resolve(data.trim().replace('v', ''))
        })
    })
}

function getPackageNodeVersion() {
    if (packageJson && packageJson.engines && packageJson.engines.node) {
        return packageJson.engines.node.trim()
    }

    return ''
}

function getPackageNpmVersion() {
    if (packageJson && packageJson.engines && packageJson.engines.npm) {
        return packageJson.engines.npm.trim()
    }

    return ''
}

function getRunningNodeVersion() {
    return process.version.trim().replace('v', '')
}

function getRunningNpmVersion() {
    return new Promise((resolve, reject) => {
        child_process.exec('npm -v', (err, stdout) => {
            if (err) {
                return reject(err)
            }

            return resolve(stdout.trim())
        })
    })
}

module.exports = {
    getNvmrcVersion,
    getPackageNodeVersion,
    getPackageNpmVersion,
    getRunningNodeVersion,
    getRunningNpmVersion,
}
