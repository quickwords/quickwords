import viteReactPlugin from 'vite-plugin-react'
import { UserConfig } from 'vite'

const config: UserConfig = {
  jsx: 'react',
  base: './',
  outDir: './dist/front',
  assetsInlineLimit: 0,
  plugins: [viteReactPlugin],
  optimizeDeps: {
    auto: false,
  },
}

export = config
