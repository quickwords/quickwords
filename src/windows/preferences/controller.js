const { BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const PreferencesManager = require('../../modules/PreferencesManager')

module.exports = {
    ctx: null,
    init() {
        this.ctx = new BrowserWindow({
            show: false,
            'minWidth': 430,
            'minHeight': 450,
            width: 430,
            height: 450,
        })

        this.ctx.loadURL(url.format({
            pathname: path.join(__dirname, 'view.html'),
            protocol: 'file:',
            slashes: true,
        }))

        this.ctx.preferencesManager = new PreferencesManager()

        return this.ctx
    },
}
