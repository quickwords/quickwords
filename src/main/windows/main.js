const { BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

module.exports = {
    show(page) {
        this.ctx.webContents.executeJavaScript(`window.vm.$router.push({ name: '${page}' })`, false, () => {
            setTimeout(() => this.ctx.show(), 50)
        })
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
