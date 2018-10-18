const config = require('../../config')
config.load()

const { app, Tray, clipboard } = require('electron')
const path = require('path')
const menu = require('./modules/menu')
const aboutWindow = require('./windows/about')
const mainWindow = require('./windows/main')
const iconPath = path.join(__dirname, '../../assets/iconTemplate.png')
const { doNotQuitAppOnWindowClosure, unregisterWindowListeners, setUpWindowMenu } = require('./helpers')
const Store = require('electron-store')
const SnippetsManager = require('./modules/SnippetsManager')
const PreferencesManager = require('./modules/PreferencesManager')
const defaultSnippets = require('./modules/defaultSnippets')
const PlatformAware = require('./modules/PlatformAware')
let appIcon
const store = new Store({
    defaults: {
        user: Math.random().toString(36).slice(2),
        theme: PlatformAware.get('theme'),
        autoLaunch: true,
        snippets: defaultSnippets,
        bufferLength: 20,
        autoUpdate: true,
    },
})

const snippetsManager = new SnippetsManager({
    store,
    clipboard,
    keyboardHandler: require('iohook'),
    keyboardSimulator: require('robotjs'),
    analytics: require('./modules/Analytics'),
})
const windows = {}

if (PlatformAware.mac()) {
    app.dock.hide()
}

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

    // if (PlatformAware.mac()) {
    doNotQuitAppOnWindowClosure(windows)
    // }

    appIcon = new Tray(iconPath)

    appIcon.setToolTip('Quickwords')
    appIcon.setContextMenu(menu)

    if (process.env.ENVIRONMENT === 'production') {
        setUpWindowMenu(app, aboutWindow)
    }
})

// if (PlatformAware.mac()) {
app.on('window-all-closed', () => {
    //
})
// }

app.on('before-quit', () => {
    unregisterWindowListeners(windows)
    snippetsManager.destructor()
})
