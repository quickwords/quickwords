import { Store } from './store'

export const GET_THEME = 'get/theme'
export const SET_PREFERENCE = 'set/preference'

export type SetPreference = {
  key: keyof Store
  value: Store[keyof Store]
}

export type GetTheme = {
  //
}
