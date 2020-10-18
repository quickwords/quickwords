import path from 'path'

type Config = {
  titleBarStyle: 'hidden' | 'default'
  notificationIcon: string
  pasteModifier: 'command' | 'control'
  trayIcon: string
}

const resolveTrayIconPath = (iconName: string) => path.join(__dirname, '../../../assets/app-icons/', iconName)

const macConfig = (): Config => ({
  titleBarStyle: 'hidden',
  notificationIcon: '../../../assets/icon.icns',
  pasteModifier: 'command',
  trayIcon: resolveTrayIconPath('macOSIconTemplate.png'),
})

const linuxConfig = (): Config => ({
  titleBarStyle: 'default',
  notificationIcon: '../../../assets/icon.ico', // @todo
  pasteModifier: 'control',
  trayIcon: resolveTrayIconPath('iconTemplate.png'), // @todo
})

const windowsConfig = (): Config => ({
  titleBarStyle: 'hidden',
  notificationIcon: '../../../assets/icon.png', // @todo
  pasteModifier: 'control',
  trayIcon: resolveTrayIconPath('windowsIconTemplate.png'), // @todo
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
