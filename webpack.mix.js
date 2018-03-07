const mix = require('laravel-mix')

mix.sass('src/styles/app.sass', 'src/styles/app.css')
mix.sass('src/windows/about/styles.sass', 'src/windows/about/styles.css')
mix.sass('src/windows/preferences/styles.sass', 'src/windows/preferences/styles.css')
