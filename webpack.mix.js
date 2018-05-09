const mix = require('laravel-mix')
const path = require('path')
const tailwindcss = require('tailwindcss')

mix.sass('src/styles/app.sass', 'src/styles/app.css')
    .options({
        processCssUrls: false,
        postCss: [ tailwindcss(path.join(__dirname, './tailwind.js')) ],
    })
