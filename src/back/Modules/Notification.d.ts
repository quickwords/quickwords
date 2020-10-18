export declare class Notification {
    show(title: string, body: string, onClick?: (event: Electron.Event) => void): boolean;
    get isSupported(): boolean;
}
