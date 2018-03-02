const { app, Tray } = require('electron')
const path = require('path')
const menu = require('./modules/menu')
const aboutWindow = require('./windows/about')
const preferencesWindow = require('./windows/preferences')
const iconPath = path.join(__dirname, '../assets/iconTemplate.png')
const { doNotQuitAppOnWindowClosure, unregisterWindowListeners } = require('./helpers')
const SnippetsManager = require('./modules/SnippetsManager')

let appIcon
const snippetsManager = new SnippetsManager()
const windows = {}

app.dock.hide()

app.on('ready', () => {
    windows.about = aboutWindow.init()
    windows.preferences = preferencesWindow.init()

    doNotQuitAppOnWindowClosure(windows)

    appIcon = new Tray(iconPath)

    appIcon.setToolTip('Quickwords')
    appIcon.setContextMenu(menu)

    // snippetsManager.register()
})

app.on('window-all-closed', () => (process.platform !== 'darwin') ? app.quit() : '')
app.on('before-quit', () => unregisterWindowListeners(windows));
