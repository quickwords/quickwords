const { Notification, shell, Menu } = require('electron')
const fetch = require('node-fetch')
const path = require('path')

module.exports.doNotQuitAppOnWindowClosure = function (windows) {
    Object.keys(windows).forEach(key => windows[key].on('close', e => {
        e.preventDefault()
        windows[key].hide()
    }))
}

module.exports.unregisterWindowListeners = function (windows) {
    Object.keys(windows).forEach(key => windows[key].removeAllListeners('close'))
}

module.exports.checkForNewVersion = async function () {
    const currentVersion = require('../../package.json').version.split('.')

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
            icon: path.join(__dirname, '../../build/icon.icns'),
        })

        notification.on('click', () => shell.openExternal(url))

        notification.show()

        return true
    }

    return false
}

module.exports.registerNativeShortcuts = function (app, windows) {
    // This menu does not show up nowhere, but it does register shortcuts like copy-paste, close and minimize
    Menu.setApplicationMenu(Menu.buildFromTemplate([
        {
            label: 'Quickwords',
            submenu: [
                {
                    label: 'About Quickwords',
                    click() {
                        windows.about.show()
                    },
                },
                { type: 'separator' },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click() {
                        app.quit()
                    },
                },
            ],
        },
        {
            label: 'Edit',
            submenu: [
                { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
                { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
                { type: 'separator' },
                { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
                { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
                { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
                { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
            ],
        },
        {
            label: 'Window',
            submenu: [
                { label: 'Minimize', accelerator: 'Command+M', selector: 'performMiniaturize:' },
                { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
                { type: 'separator' },
                { label: 'Bring All to Front', selector: 'arrangeInFront:' },
            ],
        },
    ]))
}
