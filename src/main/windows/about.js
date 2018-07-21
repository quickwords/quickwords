const { BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const platformAgnostic = require('../modules/platformAgnostic')

module.exports = {
    init() {
        this.ctx = new BrowserWindow({
            show: false,
            width: 340,
            height: 290,
            resizable: false,
            titleBarStyle: platformAgnostic.get('titleBarStyle'),
        })

        this.ctx.loadURL(url.format({
            pathname: path.join(__dirname, '../../renderer/windows/about/index.html'),
            protocol: 'file:',
            slashes: true,
        }))

        return this.ctx
    },
}
