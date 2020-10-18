import { Store } from './Store';
import { App } from 'electron';
import { Notification } from './Notification';
export declare class PreferencesManager {
    private store;
    private notification;
    private version;
    private autoLaunch;
    private updatesInterval?;
    constructor(store: Store, notification: Notification, app: App, version: string);
    enableAutoLaunch(): void;
    disableAutoLaunch(): void;
    enableAutoUpdate(): void;
    disableAutoUpdate(): void;
    private setupAutoLaunch;
    private setupAutoUpdate;
    private checkForNewVersion;
}
