const ioHook = require('iohook')

class SnippetsManager {
    constructor() {
        ioHook.on('keyup', e => {
            console.log(e)
        })

        ioHook.start()
    }
}

module.exports = SnippetsManager
