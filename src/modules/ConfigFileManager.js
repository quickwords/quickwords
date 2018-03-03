const path = require('path')
const fs = require('fs')
const os = require('os')

const configFile = path.join(os.homedir(), 'Library/Application Support/Quickwords', 'snippets.json')

class ConfigFileManager {
    addSnippet(key, value) {
        const contents = this._readFile()

        contents[key] = value

        this._writeToFile(contents)
    }

    removeSnippet(key) {
        const contents = this._readFile()

        delete contents[key]

        this._writeToFile(contents)
    }

    getSnippets() {
        this._createFileIfNecessary()

        return this._readFile()
    }

    _createFileIfNecessary() {
        if (! fs.existsSync(configFile)) {
            fs.writeFileSync(configFile, '{}', {
                encoding: 'utf8',
            })
        }
    }

    _readFile() {
        return JSON.parse(fs.readFileSync(configFile, {
            encoding: 'utf8',
        }))
    }

    _writeToFile(content) {
        fs.writeFileSync(configFile, JSON.stringify(content), {
            encoding: 'utf8',
        })
    }
}

module.exports = ConfigFileManager
