// const electron = require('electron')
// const app = electron.app
// const BrowserWindow = electron.BrowserWindow

// const path = require('path')
// const url = require('url')

// let mainWindow

// function createWindow () {
//     mainWindow = new BrowserWindow({width: 800, height: 600})

//     mainWindow.loadURL(url.format({
//         pathname: path.join(__dirname, 'index.html'),
//         protocol: 'file:',
//         slashes: true
//     }))

//     // Open the DevTools.
//     // mainWindow.webContents.openDevTools()

//     // Emitted when the window is closed.
//     mainWindow.on('closed', function () {
//         // Dereference the window object, usually you would store windows
//         // in an array if your app supports multi windows, this is the time
//         // when you should delete the corresponding element.
//         mainWindow = null
//     })
// }

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.on('ready', createWindow)

// // Quit when all windows are closed.
// // app.on('window-all-closed', function () {
//     // On OS X it is common for applications and their menu bar
//     // to stay active until the user quits explicitly with Cmd + Q
//     // if (process.platform !== 'darwin') {
//     //     app.quit()
//     // }
// // })

// app.on('activate', function () {
//     // On OS X it's common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     if (mainWindow === null) {
//         createWindow()
//     }
// })

const { app, Tray, Menu, BrowserWindow } = require('electron')
const path = require('path')

const iconPath = path.join(__dirname, '../assets/iconTemplate.png')
let appIcon
let preferencesWindow
let aboutWindow

app.dock.hide()

app.on('ready', () => {
    preferencesWindow = new BrowserWindow({
        show: false,
        width: 800,
        height: 600,
    })

    aboutWindow = new BrowserWindow({
        show: false,
        width: 400,
        height: 600,
    })

    appIcon = new Tray(iconPath)

    let contextMenu = Menu.buildFromTemplate([
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
            label: 'Preferences',
            accelerator: 'Command+,',
            click() {
                preferencesWindow.show()
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

    appIcon.setToolTip('Quickwords')
    appIcon.setContextMenu(contextMenu)
})
