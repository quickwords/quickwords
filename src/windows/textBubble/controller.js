const { BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

module.exports = {
    ctx: null,
    init(parent2) {
        this.ctx = new BrowserWindow({
            show: false,
            width: 440,
            height: 250,
            hasShadow: true,
            frame: false,
            transparent: true,
            parent: parent2,
            x: parent2.getBounds().x + parent2.getBounds().width,
            y: parent2.getBounds().y,

        })

        this.ctx.loadURL(url.format({
            pathname: path.join(__dirname, 'view.html'),
            protocol: 'file:',
            slashes: true,
        }))

        this.ctx.on('move', (e, cmd) => {
            if (this.ctx.isFocused()) {
                this.ctx.setParentWindow(null)
            }
        })

        return this.ctx
    },
}
