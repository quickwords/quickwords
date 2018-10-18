const path = require('path')
const { Notification: NativeNotification } = require('electron')

class Notification {
    static show(title, body, callback = null) {
        if (!Notification.isSupported()) {
            return false
        }

        const notification = new NativeNotification({
            title,
            body,
            icon: path.join(__dirname, '../../../assets/icon.icns'), // @todo windows/linux icon
        })

        if (callback) {
            notification.on('click', callback)
        } else {
            notification.on('click', () => {})
        }

        notification.show()

        return true
    }

    static isSupported() {
        return NativeNotification.isSupported()
    }
}

module.exports = Notification
