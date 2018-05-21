const { Menu } = require('electron')
const aboutWindow = require('../windows/about')
const preferencesWindow = require('../windows/main')
const { checkForNewVersion } = require('../helpers')

module.exports = Menu.buildFromTemplate([
    {
        label: 'About Quickwords',
        click() {
            aboutWindow.ctx.show()

            checkForNewVersion()
        },
    },
    {
        type: 'separator',
    },
    {
        label: 'Preferences',
        accelerator: 'Command+,',
        click() {
            preferencesWindow.ctx.show()
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
        accelerator: 'Command+Q',
        role: 'quit',
    },
])
