import AutoLaunch from 'auto-launch'
import { Store } from './Store'
import { App, shell } from 'electron'
import { Notification } from './Notification'

export class PreferencesManager {
  private autoLaunch: AutoLaunch

  private updatesInterval?: NodeJS.Timeout

  constructor(private store: Store, private notification: Notification, app: App, private version: string) {
    this.autoLaunch = new AutoLaunch({
      name: 'Quickwords',
      path: app.getAppPath(),
    })

    this.setupAutoLaunch()
    this.setupAutoUpdate()
  }

  public enableAutoLaunch(): void {
    this.store.set('autoLaunch', true)

    this.autoLaunch.enable()
  }

  public disableAutoLaunch(): void {
    this.store.set('autoLaunch', false)

    this.autoLaunch.disable()
  }

  public enableAutoUpdate(): void {
    this.updatesInterval = setInterval(async () => {
      const hasNewVersion = await this.checkForNewVersion()

      if (hasNewVersion && this.updatesInterval) {
        clearInterval(this.updatesInterval)
      }
    }, 9e7) // 25 hours

    setTimeout(this.checkForNewVersion, 1000)
  }

  public disableAutoUpdate(): void {
    this.store.set('autoUpdate', false)

    if (this.updatesInterval) {
      clearInterval(this.updatesInterval)
    }
  }

  private async setupAutoLaunch() {
    const isEnabled = await this.autoLaunch.isEnabled()

    if (this.store.autoLaunch && !isEnabled) {
      this.enableAutoLaunch()
    }
  }

  private setupAutoUpdate() {
    if (this.store.autoUpdate) {
      this.enableAutoLaunch()
    }
  }

  private async checkForNewVersion() {
    const currentVersion = this.version.split('.')

    let data

    try {
      const response = await fetch('https://api.github.com/repos/quickwords/quickwords/releases/latest')

      data = await response.json()
    } catch (err) {
      return false
    }

    const currentNewestVersion = data.tag_name.split('.')
    const url = data.html_url

    if (
      currentNewestVersion[0] > currentVersion[0] ||
      (currentNewestVersion[0] === currentVersion[0] && currentNewestVersion[1] > currentVersion[1]) ||
      (currentNewestVersion[0] === currentVersion[0] &&
        currentNewestVersion[1] === currentVersion[1] &&
        currentNewestVersion[2] > currentVersion[2])
    ) {
      this.notification.show(
        'New Version Available',
        `Version ${currentNewestVersion.join('.')} of Quickwords is available`,
        () => shell.openExternal(url)
      )

      return true
    }

    return false
  }
}
