import { Store } from './store';
export declare const GET_THEME = "get/theme";
export declare const SET_PREFERENCE = "set/preference";
export declare type SetPreference = {
    key: keyof Store;
    value: Store[keyof Store];
};
export declare type GetTheme = {};
