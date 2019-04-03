const process = require('process')

const {
    getNvmrcVersion,
    getPackageNodeVersion,
    getPackageNpmVersion,
    getRunningNodeVersion,
    getRunningNpmVersion,
} = require('./input.js')

const {
    logCorrectRunningVersionMessage,
    logICantGoForThatLyrics,
    logIncorrectRequirementsMessage,
    logIncorrectRunningVersionMessage,
    logToolTable,
} = require('./output.js')

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

function handleCorrectRunningVersion(payload) {
    logToolTable(payload)
    logCorrectRunningVersionMessage()
}

function handleIncorrectRequirements(nvmrcVersion, packageNodeVersion) {
    logICantGoForThatLyrics()
    logIncorrectRequirementsMessage({ packageNodeVersion, nvmrcVersion })
}

function handleIncorrectRunningVersion(payload) {
    logICantGoForThatLyrics()
    logToolTable(payload)
    logIncorrectRunningVersionMessage(payload)
}

function main({ node, npm } = {}) {
    // things we can get synchronously
    const runningNodeVersion = getRunningNodeVersion()
    const packageNodeVersion = getPackageNodeVersion()
    const packageNpmVersion = getPackageNpmVersion()

    // things we have to get asynchronously
    const getAsyncVersions = Promise.all([getNvmrcVersion(), getRunningNpmVersion()])

    let exitCode = 1

    return getAsyncVersions
        .then(([nvmrcVersion, runningNpmVersion]) => {
            if (nvmrcVersion !== packageNodeVersion) {
                handleIncorrectRequirements(nvmrcVersion, packageNodeVersion)
            } else {
                // Making this payload because it's a pain to pass the same values around
                // and have to recalculate whether it's correct or not all of the time
                const payload = getPayload(nvmrcVersion, runningNodeVersion, packageNpmVersion, runningNpmVersion)

                if (!payload.node.isCorrect || !payload.npm.isCorrect) {
                    handleIncorrectRunningVersion(payload)

                // Everything looks good, set the exit code to 0
                // so that following scripts will be executed
                } else {
                    handleCorrectRunningVersion(payload)
                    exitCode = 0
                }
            }

            process.exit(exitCode)
        })
        .catch(err => {
            console.error(err)
            process.exit(exitCode)
        })
}

module.exports = main
