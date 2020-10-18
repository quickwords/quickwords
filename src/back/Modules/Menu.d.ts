import { Menu as ElectronMenu, App } from 'electron';
import { AboutWindow } from '../Windows/AboutWindow';
import { MainWindow } from '../Windows/MainWindow';
import { PlatformAware } from './PlatformAware';
export declare class Menu {
    private windows;
    private platformAware;
    private app;
    constructor(windows: [AboutWindow, MainWindow], platformAware: PlatformAware, app: App);
    build(): ElectronMenu;
}
