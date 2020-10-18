import { Menu as ElectronMenu, App } from 'electron'
import { AboutWindow } from '../Windows/AboutWindow'
import { MainWindow } from '../Windows/MainWindow'

export class WindowMenu {
  constructor(private windows: [AboutWindow, MainWindow], private app: App) {
    //
  }

  public build(): ElectronMenu {
    return ElectronMenu.buildFromTemplate([
      {
        label: 'Quickwords',
        submenu: [
          {
            label: 'About Quickwords',
            click: () => {
              this.windows[0].show()
            },
          },
          { type: 'separator' },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: () => {
              this.app.quit()
            },
          },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          { label: 'Undo', accelerator: 'CmdOrCtrl+Z' },
          { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z' },
          { type: 'separator' },
          { label: 'Cut', accelerator: 'CmdOrCtrl+X' },
          { label: 'Copy', accelerator: 'CmdOrCtrl+C' },
          { label: 'Paste', accelerator: 'CmdOrCtrl+V' },
          { label: 'Select All', accelerator: 'CmdOrCtrl+A' },
        ],
      },
      {
        label: 'Window',
        submenu: [
          { label: 'Minimize', accelerator: 'Command+M' },
          { label: 'Close', accelerator: 'Command+W' },
          { type: 'separator' },
          { label: 'Bring All to Front' },
        ],
      },
    ])
  }
}
