// eslint-disable-next-line camelcase
const child_process = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')

const cwd = process.cwd()
const packageJsonPath = path.join(cwd, '/package.json')
const packageJson = require(packageJsonPath)

const COLOR_BAR = '\x1b[32m' // green
const COLOR_EIGHTH = '\x1b[35m' // magenta
const COLOR_ERROR = '\x1b[31m' // red
const COLOR_GOOD = '\x1b[36m' // cyan
const COLOR_LINK = '\x1b[4m\x1b[34m' // underline & blue
const COLOR_RESET = '\x1b[0m'

function _getDependencies() {
    return {
        childProcess: child_process,
        fileSystem: fs,
        nodeConsole: console,
        nodePath: path,
        nodeProcess: process,
        operatingSystem: os,
        pjson: packageJson,
    }
}

function getBadTools(isNodeCorrectVersion, isNpmCorrectVersion) {
    const badTools = []
    if (!isNodeCorrectVersion) {
        badTools.push('Node')
    }

    if (!isNpmCorrectVersion) {
        badTools.push('npm')
    }

    return badTools.join(' and ')
}

function getBarNote() {
    return `${COLOR_BAR}♫${COLOR_RESET}`
}

function getEigthNote() {
    return `${COLOR_EIGHTH}♪${COLOR_RESET}`
}

function getNvmrcVersion(fileSystem, nvmrcPath) {
    return new Promise((resolve, reject) => {
        fileSystem.readFile(nvmrcPath, 'utf8', (err, data) => {
            if (err) {
                return reject(err)
            }

            return resolve(data.trim().replace('v', ''))
        })
    })
}

function getPackageNodeVersion(pjson) {
    if (pjson && pjson.engines && pjson.engines.node) {
        return pjson.engines.node.trim()
    }

    return ''
}

function getPackageNpmVersion(pjson) {
    if (pjson && pjson.engines && pjson.engines.npm) {
        return pjson.engines.npm.trim()
    }

    return ''
}

function getPayload(requiredNodeVersion, runningNodeVersion, requiredNpmVersion, runningNpmVersion) {
    return {
        node: {
            isCorrect: requiredNodeVersion === runningNodeVersion,
            name: 'Node',
            required: requiredNodeVersion,
            running: runningNodeVersion,
        },
        npm: {
            isCorrect: requiredNpmVersion === runningNpmVersion,
            name: 'npm',
            required: requiredNpmVersion,
            running: runningNpmVersion,
        },
    }
}

function getRunningNodeVersion(nodeProcess) {
    return nodeProcess.version.trim().replace('v', '')
}

function getRunningNpmVersion(childProcess) {
    return new Promise((resolve, reject) => {
        childProcess.exec('npm -v', (err, stdout) => {
            if (err) {
                return reject(err)
            }

            return resolve(stdout.trim())
        })
    })
}

function handleIncorrectRequirements(nvmrcVersion, packageNodeVersion, nodeConsole) {
    logICantGoForThatLyrics(nodeConsole)

    // TODO: Use console.table when the
    // required Node version supports it
    nodeConsole.error('\tpackage.json\t.nvmrc')
    nodeConsole.error(`Node\t${COLOR_ERROR}${packageNodeVersion}\t\t${nvmrcVersion}${COLOR_RESET}`)

    nodeConsole.error('\nEdit package.json and/or .nvmrc to ensure they are the same version\n')
}

function handleIncorrectRunningVersion(payload, operatingSystem, nodeConsole) {
    logICantGoForThatLyrics(nodeConsole)

    // TODO: Use console.table when the
    // required Node version supports it
    logToolTable(payload, nodeConsole)

    const { node, npm } = payload
    const badTools = getBadTools(node.isCorrect, npm.isCorrect)
    const versionSingularPlural = !node.isCorrect && !npm.isCorrect ? 'versions' : 'version'

    nodeConsole.error(`\nPlease use the required ${versionSingularPlural} of ${badTools}`)
}

function handleCorrectRunningVersion(payload, nodeConsole) {
    logToolTable(payload, nodeConsole)
    nodeConsole.log('\nUsing the required versions of Node and npm\n')
}

function logICantGoForThatLyrics(nodeConsole) {
    const eigth = getEigthNote()
    const bar = getBarNote()
    const topBottomBar = `${bar} ${eigth} `.repeat(15)

    nodeConsole.error(`${topBottomBar}
${eigth}                                                         ${bar}
${bar}   I'll do anything that you want me to                  ${eigth}
${eigth}   I'd do almost anything that you want me to, yea but   ${bar}
${bar}   I can't go for that, no (Node can do)                 ${eigth}
${eigth}                                                         ${bar}
${topBottomBar}
`)
}

function logToolRow({ isCorrect, name, required, running }, nodeConsole) {
    const runningColor = isCorrect ? `${COLOR_GOOD}✔ ` : `${COLOR_ERROR}× `
    nodeConsole.log(`${name}\t${COLOR_GOOD}${required}${COLOR_RESET}\t\t${runningColor}${running}${COLOR_RESET}`)
}

function logToolTable(payload, nodeConsole) {
    // The spaces before 'Actual' are for
    // the ✔ or ×, so please leave them
    nodeConsole.log('\tRequired\t  Actual')
    logToolRow(payload.node, nodeConsole)
    logToolRow(payload.npm, nodeConsole)
}

function main({ node, npm } = {}, _ = _getDependencies()) {
    const { childProcess, fileSystem, nodeConsole, nodePath, nodeProcess, operatingSystem, pjson } = _

    // things we can get synchronously
    const runningNodeVersion = getRunningNodeVersion(nodeProcess)
    const packageNodeVersion = getPackageNodeVersion(pjson)
    const packageNpmVersion = getPackageNpmVersion(pjson)

    const nvmrcPath = nodePath.join(cwd, '/.nvmrc')
    // things we have to get asynchronously
    const getAsyncVersions = Promise.all([getNvmrcVersion(fileSystem, nvmrcPath), getRunningNpmVersion(childProcess)])

    let exitCode = 1

    return getAsyncVersions
        .then(([nvmrcVersion, runningNpmVersion]) => {
            if (nvmrcVersion !== packageNodeVersion) {
                handleIncorrectRequirements(nvmrcVersion, packageNodeVersion, nodeConsole)
            } else {
                // Making this payload because it's a pain to pass the same values around
                // and have to recalculate whether it's correct or not all of the time
                const payload = getPayload(nvmrcVersion, runningNodeVersion, packageNpmVersion, runningNpmVersion)

                if (!payload.node.isCorrect || !payload.npm.isCorrect) {
                    handleIncorrectRunningVersion(payload, operatingSystem, nodeConsole)

                // Everything looks good, set the exit code to 0
                // so that following scripts will be executed
                } else {
                    handleCorrectRunningVersion(payload, nodeConsole)
                    exitCode = 0
                }
            }

            nodeProcess.exit(exitCode)
        })
        .catch(err => {
            nodeConsole.error(err)
            nodeProcess.exit(exitCode)
        })
}

module.exports = main
