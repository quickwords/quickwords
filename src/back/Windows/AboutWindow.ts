import path from 'path'
import url from 'url'
import { BrowserWindow } from 'electron'
import { PlatformAware } from '../modules/PlatformAware'
import { WindowInterface } from './WindowInterface'

export class AboutWindow implements WindowInterface {
  private ctx: BrowserWindow

  constructor(platformAware: PlatformAware, onClose: (ctx: BrowserWindow) => (event: Electron.Event) => void) {
    this.ctx = new BrowserWindow({
      show: false,
      width: 340,
      height: 290,
      resizable: false,
      titleBarStyle: platformAware.get('titleBarStyle'),
      webPreferences: {
        nodeIntegration: true,
        worldSafeExecuteJavaScript: true,
      },
    })

    this.ctx.on('ready-to-show', () => {
      this.ctx.show()
    })

    this.ctx.on('close', onClose(this.ctx))
  }

  public destructor(): void {
    this.ctx.removeAllListeners('close')
  }

  public show(): void {
    this.ctx.loadURL(
      url.format({
        pathname: path.join(__dirname, '../../front/about.html'),
        protocol: 'file:',
        slashes: true,
      })
    )
  }
}
