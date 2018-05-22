const mix = require('laravel-mix')
const path = require('path')
const tailwindcss = require('tailwindcss')

mix
    .copyDirectory('src/main', 'out/main')
    // about window
    .copy('src/renderer/windows/about/index.html', 'out/renderer/windows/about/index.html')
    .js('src/renderer/windows/about/script.js', 'out/renderer/windows/about/script.js')
    // main window
    .copy('src/renderer/windows/main/index.html', 'out/renderer/windows/main/index.html')
    .js('src/renderer/windows/main/script.js', 'out/renderer/windows/main/script.js')
    // styles
    .sass('src/renderer/styles/app.sass', 'out/renderer/styles/app.css')
    .webpackConfig({
        node: {
            fs: 'empty',
        },
    })
    .options({
        processCssUrls: false,
        postCss: [ tailwindcss(path.join(__dirname, './tailwind.js')) ],
        uglify: false,
    })
