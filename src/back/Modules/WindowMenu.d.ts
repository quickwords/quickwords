import { Menu as ElectronMenu, App } from 'electron';
import { AboutWindow } from '../Windows/AboutWindow';
import { MainWindow } from '../Windows/MainWindow';
export declare class WindowMenu {
    private windows;
    private app;
    constructor(windows: [AboutWindow, MainWindow], app: App);
    build(): ElectronMenu;
}
