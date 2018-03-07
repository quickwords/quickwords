const mix = require('laravel-mix')

mix.sass('src/styles/app.sass', 'build/styles/app.css')
mix.sass('src/windows/about/styles.sass', 'build/styles/about.css')
mix.sass('src/windows/preferences/styles.sass', 'build/styles/preferences.css')
