const mix = require('laravel-mix')
const path = require('path')
const tailwindcss = require('tailwindcss')
const glob = require('glob-all')
const PurgecssPlugin = require('purgecss-webpack-plugin')

class TailwindExtractor {
    static extract(content) {
        return content.match(/[A-z0-9-:\/]+/g) || [];
    }
}

mix.sass('src/styles/app.sass', 'src/styles/app.css')
    .options({
        processCssUrls: false,
        postCss: [ tailwindcss(path.join(__dirname, './tailwind.js')) ],
    })

if (mix.inProduction()) {
    mix.webpackConfig({
        plugins: [
            new PurgecssPlugin({
                // Specify the locations of any files you want to scan for class names.
                paths: glob.sync([
                    path.join(__dirname, 'src/windows/**/*.html'),
                    path.join(__dirname, 'src/windows/**/*.js'),
                ]),
                extractors: [
                    {
                        extractor: TailwindExtractor,

                        // Specify the file extensions to include when scanning for
                        // class names.
                        extensions: ['html', 'js', 'vue'],
                    },
                ],
            }),
        ],
    });
}
