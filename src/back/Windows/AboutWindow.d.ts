import { BrowserWindow } from 'electron';
import { PlatformAware } from '../modules/PlatformAware';
import { WindowInterface } from './WindowInterface';
export declare class AboutWindow implements WindowInterface {
    private ctx;
    constructor(platformAware: PlatformAware, onClose: (ctx: BrowserWindow) => (event: Electron.Event) => void);
    destructor(): void;
    show(): void;
}
