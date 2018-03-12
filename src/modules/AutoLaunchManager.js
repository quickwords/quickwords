const AutoLaunch = require('auto-launch')

class AutoLaunchManager {
    constructor() {
        this.autoLaunch = new AutoLaunch({
            name: 'Quickwords',
            path: '/Applications/Quickwords.app',
        })
    }

    enable() {
        console.log('enable')
        this.autoLaunch.enable()
    }

    disable() {
        console.log('disable')
        this.autoLaunch.disable()
    }
}

module.exports = AutoLaunchManager
