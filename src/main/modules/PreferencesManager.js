const AutoLaunch = require('auto-launch')
const { Notification, shell } = require('electron')
const fetch = require('node-fetch')
const path = require('path')

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

        if (this.store.get('autoUpdate') === true) {
            this.enableAutoUpdate()
        }
    }

    isFirstLaunch() {
        if (this.store.has('autoLaunch')) {
            return false
        }

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

    async checkForNewVersion() {
        const currentVersion = require('../../../package.json').version.split('.')

        let data

        try {
            const response = await fetch('https://api.github.com/repos/quickwords/quickwords/releases/latest')
            data = await response.json()
        } catch (err) {
            return false
        }

        const currentNewestVersion = data.tag_name.split('.')
        const url = data.html_url

        if (
            currentNewestVersion[0] > currentVersion[0]
            || (currentNewestVersion[0] === currentVersion[0] && currentNewestVersion[1] > currentVersion[1])
            || (currentNewestVersion[0] === currentVersion[0] && currentNewestVersion[1] === currentVersion[1] && currentNewestVersion[2] > currentVersion[2])
        ) {
            const notification = new Notification({
                title: 'New Version Available',
                body: `Version ${currentNewestVersion.join('.')} of Quickwords is available`,
                icon: path.join(__dirname, '../../../assets/icon.icns'),
            })

            notification.on('click', () => shell.openExternal(url))

            notification.show()

            return true
        }

        return false
    }

    enableAutoUpdate() {
        this.updatesInterval = setInterval(async () => {
            const hasNewVersion = await this.checkForNewVersion()

            if (hasNewVersion) {
                clearInterval(this.updatesInterval)
            }
        }, 9e7) // 25 hours

        setTimeout(this.checkForNewVersion, 1000)
    }

    disableAutoUpdate() {
        clearInterval(this.updatesInterval)
    }
}

module.exports = PreferencesManager
