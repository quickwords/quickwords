const { BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const PlatformAware = require('../modules/PlatformAware')

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
            titleBarStyle: PlatformAware.get('titleBarStyle'),
        })

        this.ctx.loadURL(url.format({
            pathname: path.join(__dirname, '../../renderer/windows/main/index.html'),
            protocol: 'file:',
            slashes: true,
        }))

        return this.ctx
    },
}
