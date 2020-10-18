import path from 'path'
import _ from 'lodash'
import { Notification as ElectronNotification } from 'electron'

export class Notification {
  public show(title: string, body: string, onClick?: (event: Electron.Event) => void): boolean {
    if (!this.isSupported) {
      return false
    }

    const notification = new ElectronNotification({
      title,
      body,
      icon: path.join(__dirname, '../../../assets/icon.icns'), // @todo windows/linux icon
    })

    const clickHandler = onClick ?? _.noop

    notification.on('click', clickHandler)
    notification.show()

    return true
  }

  public get isSupported(): boolean {
    return ElectronNotification.isSupported()
  }
}
