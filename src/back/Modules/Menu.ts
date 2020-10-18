import { Menu as ElectronMenu, App } from 'electron'
import { AboutWindow } from '../Windows/AboutWindow'
import { MainWindow } from '../Windows/MainWindow'
import { PlatformAware } from './PlatformAware'

export class Menu {
  constructor(private windows: [AboutWindow, MainWindow], private platformAware: PlatformAware, private app: App) {
    //
  }

  public build(): ElectronMenu {
    return ElectronMenu.buildFromTemplate([
      {
        label: 'About Quickwords',
        click: () => {
          this.windows[0].show()
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'Snippets',
        click: () => {
          this.windows[1].show('Snippets')

          if (this.platformAware.mac) {
            this.app.dock.show()
          }
        },
      },
      {
        label: 'Preferences',
        click: () => {
          this.windows[1].show('Preferences')

          if (this.platformAware.mac) {
            this.app.dock.show()
          }
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'Quit',
        role: 'quit',
      },
    ])
  }
}
