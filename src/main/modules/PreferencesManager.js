const AutoLaunch = require('auto-launch')

class PreferencesManager {
    constructor(store) {
        this.store = store
        this.autoLaunch = new AutoLaunch({
            name: 'Quickwords',
            path: '/Applications/Quickwords.app',
        })

        if (this.store.get('autoLaunch') === true) {
            this.autoLaunch.isEnabled()
                .then(isEnabled => {
                    if (isEnabled === false) {
                        this.enableAutoLaunch()
                    }
                })
                .catch(() => {})
        }
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
