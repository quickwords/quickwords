import React, { useContext } from 'react'
import bg from '../../../assets/bg.svg'
import { NavigationContext } from './NavigationContext'

type Props = {
  sidebarContent: () => JSX.Element
  mainContent: () => JSX.Element
}

export function Shell({ sidebarContent, mainContent }: Props): JSX.Element | null {
  const navigation = useContext(NavigationContext)

  return (
    navigation && (
      <div className="h-screen">
        <div className="absolute inset-0">
          <img className="w-full h-full object-cover" src={bg} alt="" />
        </div>
        <div className="flex relative h-full">
          <div className="w-2/5 p-8 flex flex-col space-y-6">
            <nav>
              <ul className="flex items-end justify-around space-x-2 text-2xl leading-none">
                <li>
                  <a
                    href="#page=snippets"
                    onClick={() => navigation.navigate('snippets')}
                    className={
                      'border-blue-500 reset-outline focus:border-b-2 ' +
                      (navigation.page === 'snippets' ? 'font-bold text-3xl' : 'text-gray-700')
                    }
                  >
                    Snippets
                  </a>
                </li>
                <li>
                  <a
                    href="#page=preferences"
                    onClick={() => navigation.navigate('preferences')}
                    className={
                      'border-blue-500 reset-outline focus:border-b-2 ' +
                      (navigation.page === 'preferences' ? 'font-bold text-3xl' : 'text-gray-700')
                    }
                  >
                    Preferences
                  </a>
                </li>
              </ul>
            </nav>

            {sidebarContent()}
          </div>
          <main className="w-3/5 p-8 shadow-2xl">{mainContent()}</main>
        </div>
      </div>
    )
  )
}
