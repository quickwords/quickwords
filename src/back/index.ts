import { app, BrowserWindow, Tray, Menu as ElectronMenu } from 'electron'
import { config } from './config'
import { Store } from './Modules/Store'
import { SnippetsManager } from './Modules/SnippetsManager'
import { PlatformAware } from './Modules/PlatformAware'
import { Analytics } from './Modules/Analytics'
import { PreferencesManager } from './Modules/PreferencesManager'
import { AboutWindow } from './Windows/AboutWindow'
import { MainWindow } from './Windows/MainWindow'
import { EventHandler } from './Modules/EventHandler'
import path from 'path'
import { Menu } from './Modules/Menu'
import { WindowMenu } from './Modules/WindowMenu'
import { Notification } from './Modules/Notification'

const onWindowCloseHandler = (platformAware: PlatformAware) => (ctx: BrowserWindow) => (event: Electron.Event) => {
  event.preventDefault()

  ctx.hide()

  if (platformAware.mac) {
    app.dock.hide()
  }
}

function setup(
  snippetsManager: SnippetsManager,
  platformAware: PlatformAware,
  windows: [AboutWindow, MainWindow],
  eventHandler: EventHandler
): void {
  eventHandler.registerHandlers()

  if (platformAware.mac) {
    app.dock.hide()
  }

  const trayIcon = path.join(__dirname, '../../assets/', platformAware.get('trayIcon'))
  const appIcon = new Tray(trayIcon)
  const menu = new Menu(windows, platformAware, app)

  appIcon.setToolTip('Quickwords')
  appIcon.setContextMenu(menu.build())

  if (config.APP_ENVIRONMENT === 'production') {
    const windowMenu = new WindowMenu(windows, app)

    ElectronMenu.setApplicationMenu(windowMenu.build())
  }

  app.on('window-all-closed', () => {
    // Ignore this event
  })

  app.on('before-quit', () => {
    windows.forEach((window) => {
      window.destructor()
    })

    snippetsManager.destructor()
  })
}

function main(): void {
  const platformAware = new PlatformAware()
  const store = new Store()
  const analytics = new Analytics(platformAware)
  const notification = new Notification()
  const snippetsManager = new SnippetsManager(store, notification, platformAware, analytics)
  const preferencesManager = new PreferencesManager(store, notification, app, config.APP_VERSION)

  const aboutWindow = new AboutWindow(platformAware, onWindowCloseHandler(platformAware))
  const mainWindow = new MainWindow(platformAware, snippetsManager, onWindowCloseHandler(platformAware))

  const eventHandler = new EventHandler(store, preferencesManager)

  setup(snippetsManager, platformAware, [aboutWindow, mainWindow], eventHandler)
}

app.allowRendererProcessReuse = true

app.whenReady().then(main)
