const merge = require('webpack-merge')
const path = require('path')

const config = merge({
    VERSION: require('../package.json').version,
    WEBSITE_URL: 'https://quickwords.co',
    DONATION_URL: 'https://patreon.com/quickwords',
    GITHUB_URL: 'https://github.com/quickwords/quickwords',
    DC_URL: 'https://dczajkowski.com',
    GT_URL: 'https://github.com/gtluszcz',
}, require(`./${process.platform}`))

// global._ = path.join(__dirname, '../src/')

module.exports = process.env = merge(process.env, config)
