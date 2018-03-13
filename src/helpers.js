const { Notification, shell } = require('electron')
const fetch = require('node-fetch')
const path = require('path')

module.exports = {
    tap(object, callback) {
        callback(object)
        return object
    },
    doNotQuitAppOnWindowClosure(windows) {
        Object.keys(windows).forEach(key => windows[key].on('close', e => {
            e.preventDefault()
            windows[key].hide()
        }))
    },
    unregisterWindowListeners(windows) {
        Object.keys(windows).forEach(key => windows[key].removeAllListeners('close'))
    },
    checkForNewVersion() {
        const currentVersion = require('../package.json').version.split('.')

        fetch('https://api.github.com/repos/quickwords/quickwords/releases/latest')
            .then(response => response.json())
            .then(data => {
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
                }
            })
            .catch(() => {})
    },
}
