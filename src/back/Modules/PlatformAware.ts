import { systemPreferences } from 'electron'

type Config = {
  theme: 0 | 1
  titleBarStyle: 'hidden' | 'default'
  notificationIcon: string
  pasteModifier: 'command' | 'control'
  trayIcon: string
}

const macConfig = (): Config => ({
  theme: systemPreferences.isDarkMode() ? 0 : 1,
  titleBarStyle: 'hidden',
  notificationIcon: '../../../assets/icon.icns',
  pasteModifier: 'command',
  trayIcon: 'iconTemplate.png',
})

const linuxConfig = (): Config => ({
  theme: 1,
  titleBarStyle: 'default',
  notificationIcon: '../../../assets/icon.ico', // @todo
  pasteModifier: 'control',
  trayIcon: 'iconTemplate.png',
})

const windowsConfig = (): Config => ({
  theme: 1,
  titleBarStyle: 'hidden',
  notificationIcon: '../../../assets/icon.png',
  pasteModifier: 'control',
  trayIcon: 'windowsIconTemplate.png',
})

export class PlatformAware {
  private config: Config

  constructor() {
    if (this.mac) {
      this.config = macConfig()
    } else if (this.linux) {
      this.config = linuxConfig()
    } else if (this.windows) {
      this.config = windowsConfig()
    } else {
      throw new Error(`Unknown platform name ${this.platform}`)
    }
  }

  public get<T extends keyof Config>(key: T): Config[T] {
    return this.config[key]
  }

  public get mac(): boolean {
    return this.platform === 'darwin'
  }

  public get linux(): boolean {
    return this.platform === 'linux'
  }

  public get windows(): boolean {
    return this.platform === 'win32'
  }

  public get platform(): NodeJS.Platform {
    return process.platform
  }
}
