import { NavigationProp } from '../@types/global'
import { createContext } from 'react'

export const NavigationContext = createContext<null | NavigationProp>(null)
