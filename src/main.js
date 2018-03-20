/* eslint "no-unused-vars": "off" */
const config = require('../config')

const { app, Tray, Menu } = require('electron')
const path = require('path')
const menu = require('./modules/menu')
const aboutWindow = require('./windows/about')
const preferencesWindow = require('./windows/preferences')
const popup = require('./windows/popup')
const iconPath = path.join(__dirname, '../assets/iconTemplate.png')
const { doNotQuitAppOnWindowClosure, unregisterWindowListeners, checkForNewVersion } = require('./helpers')
const SnippetsManager = require('./modules/SnippetsManager')
const PreferencesManager = require('./modules/PreferencesManager')

let appIcon
const snippetsManager = new SnippetsManager()
const windows = {}

if (process.env.ENVIRONMENT === 'development') {
    require('electron-reload')([
        path.join(__dirname),
    ], {
        electron: require(path.join(__dirname, '../node_modules/electron')),
        ignored: /.*\.sass/,
    })
}

app.dock.hide()

app.on('ready', () => {
    const preferencesManager = new PreferencesManager()
    const isFirstLaunch = preferencesManager.init()

    if (isFirstLaunch) {
        app.relaunch()
        return app.exit(0)
    }

    windows.about = aboutWindow.init()
    windows.preferences = preferencesWindow.init()
    windows.popup = popup.init()

    windows.about.snippetsManager = snippetsManager
    windows.preferences.snippetsManager = snippetsManager
    windows.preferences.preferencesManager = preferencesManager
    windows.popup.snippetsManager = snippetsManager

    windows.preferences.on('focus', () => {
        snippetsManager.shouldMatch = false
        windows.popup.hide()
    })
    windows.preferences.on('blur', () => { snippetsManager.shouldMatch = true })

    windows.popup.on('focus', () => { snippetsManager.shouldMatch = false })
    windows.popup.on('blur', () => { snippetsManager.shouldMatch = true })

    doNotQuitAppOnWindowClosure(windows)

    appIcon = new Tray(iconPath)

    appIcon.setToolTip('Quickwords')
    appIcon.setContextMenu(menu)

    const updatesInterval = setInterval(() => {
        checkForNewVersion()
            .then(hasNewVersion => {
                if (hasNewVersion) {
                    clearInterval(updatesInterval)
                }
            })
            .catch(() => {})
    }, 4e7) // ~ 11 hours

    setTimeout(() => {
        checkForNewVersion()
            .then(hasNewVersion => {
                if (hasNewVersion) {
                    clearInterval(updatesInterval)
                }
            })
            .catch(() => {})
    }, 1000)


    // This menu does not show up nowhere, but it does register shortcuts like copy-paste, close and minimize
    if (process.env.ENVIRONMENT === 'production') {
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
})

app.on('window-all-closed', () => {})

app.on('before-quit', () => {
    unregisterWindowListeners(windows)
    snippetsManager.destructor()
})

