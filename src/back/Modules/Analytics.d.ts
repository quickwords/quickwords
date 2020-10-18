import { PlatformAware } from './PlatformAware';
declare type Event = {
    name: 'snippet-replacement';
    user: string;
    regex: boolean;
    type: 'plain' | 'js';
};
export declare class Analytics {
    private platformAware;
    constructor(platformAware: PlatformAware);
    report({ name, user, regex, type }: Event): Promise<void>;
}
export {};
