const path = require('path')
const fs = require('fs')
const os = require('os')

const configFile = path.join(os.homedir(), 'Library/Application Support/Quickwords', 'snippets.json')

class ConfigFileManager {
    constructor() {
        this._loadSnippetsFromFile()
    }

    addSnippetToConfigFile(key, value) {
        const contents = this._readConfigFile()

        contents[key] = value

        this._writeToConfigFile(contents)
    }

    removeSnippetFromConfigFile(key) {
        const contents = this._readConfigFile()

        delete contents[key]

        this._writeToConfigFile(contents)
    }

    _loadSnippetsFromFile() {
        this._createConfigFileIfNecessary()

        this.snippets = this._readConfigFile()

        console.log(this.snippets)
    }

    _createConfigFileIfNecessary() {
        if (! fs.existsSync(configFile)) {
            fs.writeFileSync(configFile, '{}', {
                encoding: 'utf8',
            })
        }
    }

    _readConfigFile() {
        return JSON.parse(fs.readFileSync(configFile, {
            encoding: 'utf8',
        }))
    }

    _writeToConfigFile(content) {
        fs.writeFileSync(configFile, JSON.stringify(content), {
            encoding: 'utf8',
        })
    }
}

module.exports = ConfigFileManager
