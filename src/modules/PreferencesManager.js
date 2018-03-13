const AutoLaunch = require('auto-launch')
const path = require('path')
const fs = require('fs')
const os = require('os')
const configFile = path.join(os.homedir(), 'Library/Application Support/Quickwords', 'config.json')

class PreferencesManager {
    constructor() {
        this.autoLaunch = new AutoLaunch({
            name: 'Quickwords',
            path: '/Applications/Quickwords.app',
        })
    }

    init() {
        return this._createFileIfNecessary()
    }

    getCurrentState() {
        return this._readFile().autoLaunch
    }

    enableAutoLaunch() {
        this.change('autoLaunch', true)

        this.autoLaunch.enable()
    }

    disableAutoLaunch() {
        this.change('autoLaunch', false)

        this.autoLaunch.disable()
    }

    change(key, value) {
        const fileContent = this._readFile()

        fileContent[key] = value

        this._writeToFile(fileContent)
    }

    _createFileIfNecessary() {
        if (! fs.existsSync(configFile)) {
            fs.writeFileSync(configFile, '{}', {
                encoding: 'utf8',
            })

            return true
        }

        return false
    }

    _readFile() {
        return JSON.parse(fs.readFileSync(configFile, {
            encoding: 'utf8',
        }))
    }

    _writeToFile(content) {
        fs.writeFileSync(configFile, JSON.stringify(content), {
            encoding: 'utf8',
        })
    }
}

module.exports = PreferencesManager
