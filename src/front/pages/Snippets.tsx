import React, { useState } from 'react'
import { Snippet } from '../../common/store'
import removeIcon from '../../../assets/icons/remove.svg'
import searchIcon from '../../../assets/icons/search.svg'
import clearIcon from '../../../assets/icons/clear.svg'
import { Shell } from '../components/Shell'
import defaultSnippets from '../../common/default-snippets'

export function Page(): JSX.Element {
  const snippets: Snippet[] = defaultSnippets
  const [selectedSnippet, setSelectedSnippet] = useState<null | Snippet>(null)

  return (
    <Shell
      mainContent={() => <Main selectedSnippet={selectedSnippet} />}
      sidebarContent={() => (
        <SideBar snippets={snippets} selectedSnippet={selectedSnippet} setSelectedSnippet={setSelectedSnippet} />
      )}
    />
  )
}

/*
 | Main
 */

type MainProps = {
  selectedSnippet: Snippet | null
}

function Main({ selectedSnippet }: MainProps): JSX.Element {
  return <pre>{selectedSnippet ? selectedSnippet.value : 'none'}</pre>
}

/*
 | SideBar
 */

type SideBarProps = {
  snippets: Snippet[]
  selectedSnippet: Snippet | null
  setSelectedSnippet: (snippet: null | Snippet) => void
}

const cls = (classes: Record<string, boolean>): string =>
  Object.entries(classes)
    .filter(([, boolean]) => boolean)
    .map(([string]) => string)
    .join(' ')

function SideBar({ snippets, selectedSnippet, setSelectedSnippet }: SideBarProps): JSX.Element {
  const [search, setSearch] = useState('')

  const searchRegex = new RegExp(`.*${search}.*`, 'i')

  return (
    <>
      <label htmlFor="search" className="sr-only">
        Search
      </label>

      <div className="relative">
        <input
          id="search"
          type="search"
          className="w-full rounded-full border pl-12 px-5 h-10 text-gray-800 placeholder-gray-500"
          placeholder="Search..."
          value={search}
          onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => setSearch(target.value)}
        />

        <div className="absolute inset-y-0 left-0 h-full px-4 flex items-center justify-center pointer-events-none">
          <img className="w-6 h-6 filter-gray-500" src={searchIcon} alt="" />
        </div>

        {search.length > 0 && (
          <div className="absolute inset-y-0 right-0 h-full px-2 flex items-center justify-center pointer-events-none">
            <button className="pointer-events-auto rounded-full p-1" onClick={() => setSearch('')}>
              <img className="w-4 h-4 filter-gray-500" src={clearIcon} alt="" />
            </button>
          </div>
        )}
      </div>

      <ul className="flex flex-col space-y-3">
        {snippets
          .filter(({ key, value }) => searchRegex.test(key) || searchRegex.test(value))
          .map((snippet) => (
            <li key={snippet.id} className="relative">
              <button
                className="bg-gray-200 w-full rounded-lg overflow-hidden h-12 flex items-center border-t-4 border-gray-200"
                onClick={() => setSelectedSnippet(snippet)}
              >
                <div
                  className={cls({
                    'bg-gray-200 border-b-4 border-transparent px-5 w-full h-full flex items-center pr-14 justify-between space-x-2': true,
                    'border-blue-500': selectedSnippet?.id === snippet.id,
                  })}
                >
                  <div className="flex-1 truncate text-start">{snippet.key}</div>
                  <div className="flex space-x-1">
                    <div className="rounded-full border border-gray-400 text-gray-900 px-3 text-sm">regex</div>
                    <div className="rounded-full border border-gray-400 text-gray-900 px-3 text-sm">js</div>
                  </div>
                </div>
              </button>
              <div className="absolute inset-y-0 right-0 flex items-center justify-center w-14 p-4 pointer-events-none">
                <button className="pointer-events-auto rounded-full">
                  <img className="w-6 h-6" src={removeIcon} alt="" />
                </button>
              </div>
            </li>
          ))}
      </ul>
    </>
  )
}
