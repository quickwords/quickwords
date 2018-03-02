const { app, Tray } = require('electron')
const path = require('path')
const menu = require('./modules/menu')
const aboutWindow = require('./windows/about')
const preferencesWindow = require('./windows/preferences')
const iconPath = path.join(__dirname, '../assets/iconTemplate.png')

let appIcon

app.dock.hide()

app.on('ready', () => {
    aboutWindow.init()
    preferencesWindow.init()

    appIcon = new Tray(iconPath)

    appIcon.setToolTip('Quickwords')
    appIcon.setContextMenu(menu)
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('before-quit', () => {
    aboutWindow.ctx.removeAllListeners('close')
    preferencesWindow.ctx.removeAllListeners('close')
});
