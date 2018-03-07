const { app, Tray } = require('electron')
const path = require('path')
const menu = require('./modules/menu')
const aboutWindow = require('./windows/about/controller')
const preferencesWindow = require('./windows/preferences/controller')
const iconPath = path.join(__dirname, '../assets/iconTemplate.png')
const { doNotQuitAppOnWindowClosure, unregisterWindowListeners } = require('./helpers')
const SnippetsManager = require('./modules/SnippetsManager')
const isDev = require('electron-is-dev')

let appIcon
const snippetsManager = new SnippetsManager()
const windows = {}

if (isDev) {
    require('electron-reload')([
        path.join(__dirname, '../build/styles'),
        path.join(__dirname),
    ], {
        electron: require(path.join(__dirname, '../node_modules/electron')),
        ignored: /.*\.sass/,
    })
}

app.dock.hide()

app.on('ready', () => {
    windows.about = aboutWindow.init()
    windows.preferences = preferencesWindow.init()

    windows.about.snippetsManager = snippetsManager
    windows.preferences.snippetsManager = snippetsManager

    // windows.preferences.on('focus', () => snippetsManager.shouldMatch = false)
    // windows.preferences.on('blur', () => snippetsManager.shouldMatch = true)

    doNotQuitAppOnWindowClosure(windows)

    appIcon = new Tray(iconPath)

    appIcon.setToolTip('Quickwords')
    appIcon.setContextMenu(menu)
})

app.on('window-all-closed', () => {})

app.on('before-quit', () => {
    unregisterWindowListeners(windows)
    snippetsManager.destructor()
})
