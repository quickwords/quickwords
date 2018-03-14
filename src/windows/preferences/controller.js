const { BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

module.exports = {
    ctx: null,
    init() {
        this.ctx = new BrowserWindow({
            show: false,
            'minWidth': 470,
            'minHeight': 470,
            width: 430,
            height: 470,
            titleBarStyle: 'hidden',
        })

        this.ctx.loadURL(url.format({
            pathname: path.join(__dirname, 'view.html'),
            protocol: 'file:',
            slashes: true,
        }))

        this.ctx.showTextBubble = (r) => {
            BrowserWindow.fromId(3).setPosition(this.ctx.getBounds().x + this.ctx.getBounds().width,this.ctx.getBounds().y + r - 125 + 18,true)
            BrowserWindow.fromId(3).setSize(440,250,true)
            BrowserWindow.fromId(3).setParentWindow(this.ctx)
            BrowserWindow.fromId(3).show()
        }





        return this.ctx
    },
}
