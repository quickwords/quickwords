const AutoLaunch = require('auto-launch')
const path = require('path')
const fs = require('fs')
const os = require('os')
const configFile = path.join(os.homedir(), 'Library/Application Support/Quickwords', 'config.json')

class PreferencesManager {
    constructor(store) {
        this.store = store
        this.autoLaunch = new AutoLaunch({
            name: 'Quickwords',
            path: '/Applications/Quickwords.app',
        })
    }

    isFirstLaunch() {
        if (this.store.has('autoLaunch')) {
            return false
        }

        this.store.set('autoLaunch', true)

        return true
    }

    enableAutoLaunch() {
        this.store.set('autoLaunch', true)

        this.autoLaunch.enable()
    }

    disableAutoLaunch() {
        this.store.set('autoLaunch', false)

        this.autoLaunch.disable()
    }
}

module.exports = PreferencesManager
