const { BrowserWindow } = require('electron')

module.exports = {
    ctx: null,
    init() {
        return this.ctx = new BrowserWindow({
            show: false,
            width: 800,
            height: 600,
        })
    },
}
