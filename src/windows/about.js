const { BrowserWindow } = require('electron')

module.exports = {
    ctx: null,
    init() {
        return this.ctx = new BrowserWindow({
            show: false,
            width: 400,
            height: 600,
        })
    },
}
