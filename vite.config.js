const viteReactPlugin = require('vite-plugin-react')

module.exports = {
  jsx: 'react',
  base: './',
  outDir: './dist/front',
  assetsInlineLimit: 0,
  plugins: [viteReactPlugin],
  optimizeDeps: {
    auto: false,
  },
}
