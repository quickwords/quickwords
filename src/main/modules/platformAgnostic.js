const { app, systemPreferences } = require('electron')

module.exports = {
    m: {
        theme: systemPreferences.isDarkMode() ? 0 : 1,
        titleBarStyle: 'hidden',
        notificationIcon: '../../../assets/icon.icns',
    },
    l: {
        theme: 1,
        titleBarStyle: 'default',
        notificationIcon: '../../../assets/icon.ico', // @todo
    },
    w: {
        theme: 1,
        titleBarStyle: 'default',
        notificationIcon: '../../../assets/icon.png', // @todo
    },
    get(key) {
        if (this.mac()) {
            return this.m[key]
        } else if (this.linux()) {
            return this.l[key]
        } else if (this.windows()) {
            return this.w[key]
        }

        throw new Error('Could not specify the platform')
    },
    mac() {
        return process.platform === 'darwin'
    },
    linux() {
        return process.platform === 'linux'
    },
    windows() {
        return process.platform === 'win32'
    },
}
