const { Menu } = require('electron')
const aboutWindow = require('../windows/about')
const mainWindow = require('../windows/main')

module.exports = Menu.buildFromTemplate([
    {
        label: 'About Quickwords',
        click() {
            aboutWindow.ctx.show()
        },
    },
    {
        type: 'separator',
    },
    {
        label: 'Snippets',
        // accelerator: 'Command+S',
        click() {
            mainWindow.navigate('Snippets')
            setTimeout(() => mainWindow.ctx.show(), 500)
        },
    },
    {
        label: 'Preferences',
        // accelerator: 'Command+,',
        click() {
            mainWindow.navigate('Preferences')
            setTimeout(() => mainWindow.ctx.show(), 500)
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
