const { BrowserWindow } = require('electron')

module.exports = {
    ctx: null,
    init() {
        this.ctx = new BrowserWindow({
            show: false,
            width: 400,
            height: 600,
        })

        this.ctx.on('close', e => {
            console.log(e)
            e.preventDefault()
            this.ctx.hide()
        })

        return this.ctx
    },
}
