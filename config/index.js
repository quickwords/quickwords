const merge = require('webpack-merge')
const path = require('path')
const isDev = require('electron-is-dev')

const config = merge({
    ENVIRONMENT: isDev ? 'development' : 'production',
    VERSION: require('../package.json').version,
    WEBSITE_URL: 'https://quickwords.co',
    DONATION_URL: 'https://patreon.com/quickwords',
    GITHUB_URL: 'https://github.com/quickwords/quickwords',
    DC_URL: 'https://dczajkowski.com',
    GT_URL: 'https://github.com/gtluszcz',
}, require(`./${process.platform}`))

function load() {
    process.env = merge(process.env, config)
}

module.exports = { load }
