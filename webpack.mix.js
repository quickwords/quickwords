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
    })

if (mix.inProduction()) {
    mix.webpackConfig({
        plugins: [
            new PurgecssPlugin({
                // Specify the locations of any files you want to scan for class names.
                paths: glob.sync([
                    path.join(__dirname, 'src/renderer/windows/**/*.html'),
                    path.join(__dirname, 'src/renderer/windows/**/*.js'),
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
