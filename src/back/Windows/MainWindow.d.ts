import { BrowserWindow } from 'electron';
import { PlatformAware } from '../modules/PlatformAware';
import { SnippetsManager } from '../Modules/SnippetsManager';
import { WindowInterface } from './WindowInterface';
export declare class MainWindow implements WindowInterface {
    private ctx;
    constructor(platformAware: PlatformAware, snippetsManager: SnippetsManager, onClose: (ctx: BrowserWindow) => (event: Electron.Event) => void);
    destructor(): void;
    show(page: 'Snippets' | 'Preferences'): Promise<void>;
}
