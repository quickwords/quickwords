import { PreferencesManager } from './PreferencesManager';
import { Store } from './Store';
export declare class EventHandler {
    private store;
    private preferencesManager;
    private ipc;
    constructor(store: Store, preferencesManager: PreferencesManager);
    registerHandlers(): void;
}
