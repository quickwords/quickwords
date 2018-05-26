const { BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

module.exports = {
    navigate(to) {
        this.ctx.webContents.executeJavaScript(`window.vm.$router.push({ name: '${to}' })`)
    },
    init() {
        this.ctx = new BrowserWindow({
            show: false,
            minWidth: 920,
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
