const path = require('path')
const os = require('os')

module.exports = {
    CONFIG_PATH: path.join(os.homedir(), 'Library/Application Support/Quickwords', 'config.json'),
    SNIPPETS_PATH: path.join(os.homedir(), 'Library/Application Support/Quickwords', 'snippets.json'),
}
