const { Notification, shell } = require('electron')
const fetch = require('node-fetch')
const path = require('path')

module.exports = {
    doNotQuitAppOnWindowClosure(windows) {
        Object.keys(windows).forEach(key => windows[key].on('close', e => {
            e.preventDefault()
            windows[key].hide()
        }))
    },
    unregisterWindowListeners(windows) {
        Object.keys(windows).forEach(key => windows[key].removeAllListeners('close'))
    },
    async checkForNewVersion() {
        const currentVersion = require('../package.json').version.split('.')

        let response
        let data

        try {
            response = await fetch('https://api.github.com/repos/quickwords/quickwords/releases/latest')
            data = await response.json()
        } catch (e) {
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
                icon: path.join(__dirname, '../build/icon.icns'),
            })

            notification.on('click', () => shell.openExternal(url))

            notification.show()

            return true
        }

        return false
    },
}
