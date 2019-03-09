const { app, Menu } = require('electron')
const PlatformAware = require('./PlatformAware')
const aboutWindow = require('../windows/about')
const mainWindow = require('../windows/main')

module.exports = Menu.buildFromTemplate([
    {
        label: 'About Quickwords',
        click() {
            aboutWindow.show()
        },
    },
    {
        type: 'separator',
    },
    {
        label: 'Snippets',
        // accelerator: 'Command+S',
        click() {
            mainWindow.show('Snippets')

            if (PlatformAware.mac()) {
                app.dock.show()
            }
        },
    },
    {
        label: 'Preferences',
        // accelerator: 'Command+,',
        click() {
            mainWindow.show('Preferences')

            if (PlatformAware.mac()) {
                app.dock.show()
            }
        },
    },
    {
        type: 'separator',
    },
    // {
    //     label: 'Disable',
    //     submenu: [
    //         {label: 'Item 3' },
    //         {label: 'Item 4' },
    //         {label: 'Item 5' },
    //     ],
    // },
    // {
    //     type: 'separator',
    // },
    {
        label: 'Quit',
        // accelerator: 'Command+Q',
        role: 'quit',
    },
])
