const { BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

module.exports = {
    init() {
        this.ctx = new BrowserWindow({
            show: false,
            minWidth: 470,
            minHeight: 470,
            width: 430,
            height: 470,
            titleBarStyle: 'hidden',
        })

        this.ctx.loadURL(url.format({
            pathname: path.join(__dirname, 'view.html'),
            protocol: 'file:',
            slashes: true,
        }))

        this.ctx.showPopup = (position) => {
            const popupWindow = require('../popup/controller')

            popupWindow.ctx.setPosition(this.ctx.getBounds().x + this.ctx.getBounds().width, this.ctx.getBounds().y + position - 125 + 18, true)
            popupWindow.ctx.setSize(440, 250, true)
            popupWindow.ctx.setParentWindow(this.ctx)
            popupWindow.ctx.show()

            this.ctx.focus()
        }

        return this.ctx
    },
}
