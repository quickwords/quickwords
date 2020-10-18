/// <reference types="node" />
declare type Config = {
    titleBarStyle: 'hidden' | 'default';
    notificationIcon: string;
    pasteModifier: 'command' | 'control';
    trayIcon: string;
};
export declare class PlatformAware {
    private config;
    constructor();
    get<T extends keyof Config>(key: T): Config[T];
    get mac(): boolean;
    get linux(): boolean;
    get windows(): boolean;
    get platform(): NodeJS.Platform;
}
export {};
