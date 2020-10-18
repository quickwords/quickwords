export type Page = 'snippets' | 'preferences'

export type NavigationProp = {
  page: Page
  navigate: (page: Page) => void
}
