const { app, Tray } = require('electron')
const path = require('path')
const menu = require('./modules/menu')
const aboutWindow = require('./windows/about')
const preferencesWindow = require('./windows/preferences')
const iconPath = path.join(__dirname, '../assets/iconTemplate.png')
const { doNotQuitAppOnWindowClosure, unregisterWindowListeners } = require('./helpers')
const SnippetsManager = require('./modules/SnippetsManager')
const isDev = require('electron-is-dev')

let appIcon
const snippetsManager = new SnippetsManager()
const windows = {}

if (isDev) {
    require('electron-reload')(__dirname, {
        electron: require(path.join(__dirname, '../node_modules/electron')),
    })
}

app.dock.hide()

app.on('ready', () => {
    windows.about = aboutWindow.init()
    windows.preferences = preferencesWindow.init()

    windows.preferences.snippetsManager = snippetsManager

    doNotQuitAppOnWindowClosure(windows)

    appIcon = new Tray(iconPath)

    appIcon.setToolTip('Quickwords')
    appIcon.setContextMenu(menu)
})

app.on('window-all-closed', () => {})
app.on('before-quit', () => unregisterWindowListeners(windows))
