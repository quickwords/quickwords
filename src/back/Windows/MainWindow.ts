import path from 'path'
import url from 'url'
import { BrowserWindow, Menu } from 'electron'
import { PlatformAware } from '../modules/PlatformAware'
import { SnippetsManager } from '../Modules/SnippetsManager'
import { WindowInterface } from './WindowInterface'

export class MainWindow implements WindowInterface {
  private ctx: BrowserWindow

  constructor(
    platformAware: PlatformAware,
    snippetsManager: SnippetsManager,
    onClose: (ctx: BrowserWindow) => (event: Electron.Event) => void
  ) {
    this.ctx = new BrowserWindow({
      show: false,
      minWidth: 940,
      minHeight: 360,
      width: 940,
      height: 600,
      titleBarStyle: platformAware.get('titleBarStyle'),
      webPreferences: {
        nodeIntegration: true,
      },
    })

    this.ctx.loadURL(
      url.format({
        pathname: path.join(__dirname, '../../front/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    )

    this.ctx.on('focus', () => {
      snippetsManager.stopMatching()
    })

    this.ctx.on('blur', () => {
      snippetsManager.startMatching()
    })

    this.ctx.on('close', onClose(this.ctx))
  }

  public destructor(): void {
    this.ctx.removeAllListeners('close')
  }

  public async show(page: 'Snippets' | 'Preferences'): Promise<void> {
    // await this.ctx.webContents.executeJavaScript(`window.vm.$router.push({ name: '${page}' })`, false)

    setTimeout(() => this.ctx.show(), 50)
  }
}
