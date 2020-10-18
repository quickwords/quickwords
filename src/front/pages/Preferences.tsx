import React from 'react'
import { Shell } from '../components/Shell'

export function Page(): JSX.Element {
  return <Shell mainContent={() => <Main />} sidebarContent={() => <SideBar />} />
}

/*
 | Main
 */

export function Main(): JSX.Element {
  return <div>Preferences Main</div>
}

/*
 | SideBar
 */

export function SideBar(): JSX.Element {
  return <div>Preferences SideBar</div>
}
