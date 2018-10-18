const { BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const PlatformAware = require('../modules/PlatformAware')

module.exports = {
    init() {
        this.ctx = new BrowserWindow({
            show: false,
            width: 340,
            height: 290,
            resizable: false,
            titleBarStyle: PlatformAware.get('titleBarStyle'),
        })

        this.ctx.on('ready-to-show', () => {
            this.ctx.show()
        })

        return this.ctx
    },
    load() {
        this.ctx.loadURL(url.format({
            pathname: path.join(__dirname, '../../renderer/windows/about/index.html'),
            protocol: 'file:',
            slashes: true,
        }))
    },
    show() {
        this.load()
    },
}
