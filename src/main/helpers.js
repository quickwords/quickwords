const { app, Menu } = require('electron')

module.exports.doNotQuitAppOnWindowClosure = function (windows) {
    Object.keys(windows).forEach(key => windows[key].on('close', e => {
        e.preventDefault()
        windows[key].hide()
        app.dock.hide()
    }))
}

module.exports.unregisterWindowListeners = function (windows) {
    Object.keys(windows).forEach(key => windows[key].removeAllListeners('close'))
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
