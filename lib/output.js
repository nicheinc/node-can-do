const COLOR_BAR = '\x1b[32m' // green
const COLOR_EIGHTH = '\x1b[35m' // magenta
const COLOR_ERROR = '\x1b[31m' // red
const COLOR_GOOD = '\x1b[36m' // cyan
const COLOR_LINK = '\x1b[4m\x1b[34m' // underline & blue
const COLOR_RESET = '\x1b[0m'

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

function getICantGoForThatLyrics() {
    const eigth = getEigthNote()
    const bar = getBarNote()
    const topBottomBar = `${bar} ${eigth} `.repeat(15)

    return `${topBottomBar}
${eigth}                                                         ${bar}
${bar}   I'll do anything that you want me to                  ${eigth}
${eigth}   I'd do almost anything that you want me to, yea but   ${bar}
${bar}   I can't go for that, no (Node can do)                 ${eigth}
${eigth}                                                         ${bar}
${topBottomBar}
`
}

function getRunningColor(required, isCorrect) {
    if (!required) {
        return `${COLOR_GOOD}  `
    }

    return isCorrect ? `${COLOR_GOOD}✔ ` : `${COLOR_ERROR}× `
}

function getShesGoneLyrics() {
    const eigth = getEigthNote()
    const bar = getBarNote()
    const topBottomBar = `${bar} ${eigth} `.repeat(11)

    return `${topBottomBar}
${eigth}                                         ${bar}
${bar}   She's gone (she's gone)               ${eigth}
${eigth}   Oh I, oh I                            ${bar}
${bar}   I better how learn how to face it     ${eigth}
${eigth}   She's gone (she's gone)               ${bar}
${bar}   Oh I, oh I                            ${eigth}
${eigth}   I'd pay the devil to replace her      ${bar}
${bar}   She's gone, she's gone,               ${eigth}
${eigth}   Oh I                                  ${bar}
${bar}   What went wrong?                      ${eigth}
${eigth}                                         ${bar}
${topBottomBar}
`
}

function logCorrectRunningVersionMessage() {
    console.log('\nYou are using the required versions of Node and npm\n')
}

function logICantGoForThatLyrics() {
    console.error(getICantGoForThatLyrics())
}

function logIncorrectRequirementsMessage({ packageNodeVersion, nvmrcVersion }) {
    // TODO: Use console.table when the
    // required Node version supports it
    console.error('\tpackage.json\t.nvmrc')
    console.error(`Node\t${COLOR_ERROR}${packageNodeVersion}\t\t${nvmrcVersion}${COLOR_RESET}`)

    console.error('\nEdit package.json and/or .nvmrc to ensure they are the same version\n')
}

function logIncorrectRunningVersionMessage({ node, npm }) {
    const badTools = getBadTools(node.isCorrect, npm.isCorrect)
    const versionSingularPlural = !node.isCorrect && !npm.isCorrect ? 'versions' : 'version'

    console.error(`\nPlease use the required ${versionSingularPlural} of ${badTools}`)
}

function logMissingRequirementsMessage({ node, npm }) {
    console.error(``)

    if (!node.required) {
        console.error(`Required version of Node is missing. Please add it to the 'engines' property in 'package.json' and/or an .nvmrc file`)
    }

    if (!npm.required) {
        console.error(`Required version of npm is missing. Please add it to the 'engines' property in 'package.json'`)
    }
}

function logShesGoneLyrics() {
    console.log(getShesGoneLyrics())
}

function logToolRow({ isCorrect, name, required, running }) {
    const requiredColor = required ? `${COLOR_GOOD}  ` : `${COLOR_ERROR}× `
    const runningColor = getRunningColor(required, isCorrect)
    console.log(`${name}\t${requiredColor}${required || '?'}     ${COLOR_RESET}\t${runningColor}${running}${COLOR_RESET}`)
}

function logToolTable(payload) {
    // The spaces before 'Actual' are for
    // the ✔ or ×, so please leave them
    console.log('\t  Required\t  Actual')
    logToolRow(payload.node)
    logToolRow(payload.npm)
}

module.exports = {
    logCorrectRunningVersionMessage,
    logICantGoForThatLyrics,
    logIncorrectRequirementsMessage,
    logIncorrectRunningVersionMessage,
    logMissingRequirementsMessage,
    logShesGoneLyrics,
    logToolTable,
}
