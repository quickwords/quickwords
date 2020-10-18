import { PreferencesManager } from './PreferencesManager'
import { ipcMain } from 'electron'
import { SET_PREFERENCE, GET_THEME, SetPreference, GetTheme } from '../../common/events'
import { Store } from './Store'

export class EventHandler {
  private ipc: Electron.IpcMain

  constructor(private store: Store, private preferencesManager: PreferencesManager) {
    this.ipc = ipcMain
  }

  public registerHandlers(): void {
    this.ipc.on(SET_PREFERENCE, (event: Electron.IpcMainEvent, args: SetPreference) => {
      console.log('Received', SET_PREFERENCE, event, args)

      // this.preferencesManager.
    })

    this.ipc.on(GET_THEME, (event: Electron.IpcMainEvent, args: GetTheme) => {
      console.log('Received', GET_THEME, event, args)

      return this.store.theme
    })
  }
}
