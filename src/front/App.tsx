import React, { useState, useCallback, useEffect } from 'react'
import { Page as SnippetsPage } from './pages/Snippets'
import { Page as PreferencesPage } from './pages/Preferences'
import { Page } from './@types/global'
import { NavigationContext } from './components/NavigationContext'

const pages = ['snippets', 'preferences']

const getPageFromHash = (hash: string): Page => {
  const params = new URLSearchParams(hash.substring(1))
  const page = params.get('page')
  const isValidPage = (candidate: string): candidate is Page => pages.includes(candidate)

  return page === null || !isValidPage(page) ? 'snippets' : page
}

export function App(): JSX.Element {
  const [page, setPage] = useState<Page>(getPageFromHash(window.location.hash))

  useEffect(() => {
    const navigationHandler = ({ target }: PopStateEvent) => setPage(getPageFromHash((target as Window).location.hash))

    window.addEventListener('popstate', navigationHandler)

    return () => window.removeEventListener('popstate', navigationHandler)
  }, [setPage])

  const navigate = useCallback((page: Page) => {
    window.history.pushState({}, '', `#page=${page}`)

    window.dispatchEvent(new Event('popstate'))
  }, [])

  const pageComponent = () => {
    switch (page) {
      case 'snippets':
        return <SnippetsPage />
      case 'preferences':
        return <PreferencesPage />
      default:
        return <div>An Error Occurred.</div>
    }
  }

  return (
    <NavigationContext.Provider
      value={{
        page,
        navigate,
      }}
    >
      {pageComponent()}
    </NavigationContext.Provider>
  )
}
