const { BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

module.exports = {
    init() {
        this.ctx = new BrowserWindow({
            show: false,
            minWidth: 900,
            minHeight: 360,
            width: 940,
            height: 600,
            titleBarStyle: 'hidden',
        })

        this.ctx.loadURL(url.format({
            pathname: path.join(__dirname, '../../renderer/windows/main/index.html'),
            protocol: 'file:',
            slashes: true,
        }))

        return this.ctx
    },
}
