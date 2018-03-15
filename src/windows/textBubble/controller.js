const { BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

module.exports = {
    init() {
        const preferencesWindow = require('../preferences/controller')

        this.ctx = new BrowserWindow({
            show: false,
            width: 440,
            height: 250,
            hasShadow: true,
            frame: false,
            transparent: true,
            parent: preferencesWindow.ctx,
            x: preferencesWindow.ctx.getBounds().x + preferencesWindow.ctx.getBounds().width,
            y: preferencesWindow.ctx.getBounds().y,
        })

        this.ctx.loadURL(url.format({
            pathname: path.join(__dirname, 'view.html'),
            protocol: 'file:',
            slashes: true,
        }))

        this.ctx.on('move', () => {
            if (this.ctx.isFocused()) {
                this.ctx.setParentWindow(null)
            }
        })

        return this.ctx
    },
}
