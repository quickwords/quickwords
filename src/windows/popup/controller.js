const { BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

const WIDTH = 440
const HEIGHT = 250

module.exports = {
    init() {
        const preferencesWindow = require('../preferences/controller')

        this.ctx = new BrowserWindow({
            show: false,
            width: WIDTH,
            height: HEIGHT,
            hasShadow: true,
            frame: false,
            transparent: true,
            parent: preferencesWindow.ctx,
            x: preferencesWindow.ctx.getBounds().x + preferencesWindow.ctx.getBounds().width,
            y: preferencesWindow.ctx.getBounds().y,
            hasShadow: false,
        })

        this.ctx.loadURL(url.format({
            pathname: path.join(__dirname, 'view.html'),
            protocol: 'file:',
            slashes: true,
        }))

        this.ctx.on('move', () => {
            if (this.ctx.isFocused()) {
                this.ctx.setParentWindow(null)

                this.ctx.webContents.executeJavaScript('vm.moved()')
            }
        })

        return this.ctx
    },
    attach(preferencesWindow, position, snippet) {
        this.ctx.setPosition(preferencesWindow.ctx.getBounds().x + preferencesWindow.ctx.getBounds().width - 10, preferencesWindow.ctx.getBounds().y + position - 125 + 18, true)
        this.ctx.setSize(WIDTH, HEIGHT, true)
        this.ctx.setParentWindow(preferencesWindow.ctx)
        this.ctx.show()
        this.ctx.webContents.executeJavaScript('vm.attached();')
        this.ctx.webContents.executeJavaScript(`vm.setSnippet(${JSON.stringify(snippet)});`)
        this.isAttached = true
    },
}
