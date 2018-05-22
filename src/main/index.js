const config = require('../../config')
config.load()

const { app, Tray } = require('electron')
const path = require('path')
const menu = require('./modules/menu')
const aboutWindow = require('./windows/about')
const mainWindow = require('./windows/main')
const iconPath = path.join(__dirname, '../../assets/iconTemplate.png')
const { doNotQuitAppOnWindowClosure, unregisterWindowListeners, checkForNewVersion, registerNativeShortcuts } = require('./helpers')
const Store = require('electron-store')
const SnippetsManager = require('./modules/SnippetsManager')
const PreferencesManager = require('./modules/PreferencesManager')
const defaultSnippets = require('./modules/defaultSnippets')
let appIcon
const store = new Store({
    defaults: {
        theme: 0,
        autoLaunch: true,
        snippets: defaultSnippets,
    },
})
const snippetsManager = new SnippetsManager(store)
const windows = {}

if (process.env.ENVIRONMENT === 'development') {
    require('electron-reload')([
        path.join(__dirname),
    ], {
        electron: require(path.join(__dirname, '../../node_modules/electron')),
        ignored: /.*\.sass/,
    })
}

app.dock.hide()

app.on('ready', () => {
    const preferencesManager = new PreferencesManager(store)

    if (preferencesManager.isFirstLaunch()) {
        app.relaunch()
        app.exit(0)
        return
    }

    windows.about = aboutWindow.init()
    windows.main = mainWindow.init()

    windows.about.preferencesManager = preferencesManager
    windows.main.preferencesManager = preferencesManager

    windows.main.on('focus', () => {
        snippetsManager.shouldMatch = false
    })
    windows.main.on('blur', () => {
        snippetsManager.shouldMatch = true
    })

    doNotQuitAppOnWindowClosure(windows)

    appIcon = new Tray(iconPath)

    appIcon.setToolTip('Quickwords')
    appIcon.setContextMenu(menu)

    setTimeout(checkForNewVersion, 1000)

    if (process.env.ENVIRONMENT === 'production') {
        registerNativeShortcuts(app, windows)
    }
})

app.on('window-all-closed', () => {})

app.on('before-quit', () => {
    unregisterWindowListeners(windows)
    snippetsManager.destructor()
})
