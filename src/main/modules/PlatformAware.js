const { systemPreferences } = require('electron')

const macConfig = () => ({
    theme: systemPreferences.isDarkMode() ? 0 : 1,
    titleBarStyle: 'hidden',
    notificationIcon: '../../../assets/icon.icns',
    pasteModifier: 'command',
})

const linuxConfig = () => ({
    theme: 1,
    titleBarStyle: 'default',
    notificationIcon: '../../../assets/icon.ico', // @todo
    pasteModifier: 'control',
})

const windowsConfig = () => ({
    theme: 1,
    titleBarStyle: 'default',
    notificationIcon: '../../../assets/icon.png',
    pasteModifier: 'control',
})

class PlatformAware {
    static get(key) {
        if (this.mac()) {
            return macConfig()[key]
        } else if (this.linux()) {
            return linuxConfig()[key]
        } else if (this.windows()) {
            return windowsConfig()[key]
        }

        throw new Error('Could not specify the platform')
    }

    static mac() {
        return process.platform === 'darwin'
    }

    static linux() {
        return process.platform === 'linux'
    }

    static windows() {
        return process.platform === 'win32'
    }
}

module.exports = PlatformAware
