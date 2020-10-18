import { Store as StoreContent } from '../../common/store';
export declare class Store {
    private store;
    constructor();
    set<T extends keyof StoreContent>(key: T, value: StoreContent[T]): void;
    get user(): StoreContent['user'];
    get theme(): StoreContent['theme'];
    get autoLaunch(): StoreContent['autoLaunch'];
    get snippets(): StoreContent['snippets'];
    get bufferLength(): StoreContent['bufferLength'];
    get autoUpdate(): StoreContent['autoUpdate'];
}
