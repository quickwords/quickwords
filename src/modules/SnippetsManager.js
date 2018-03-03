const ioHook = require('iohook')
const charTable = require('./charTable')
const ConfigFileManager = require('./ConfigFileManager')

class SnippetsManager {
    constructor() {
        this.configFile = new ConfigFileManager()

        this.buffer = ''
        this.modifierPressed = false

        ioHook.on('keydown', e => this._onKeyDown(e))
        ioHook.on('keyup', e => this._onKeyUp(e))

        ioHook.start()
    }

    addSnippet(key, value) {
        this.snippets[key] = value
        this.configFile.addSnippetToConfigFile(key, value)
    }

    removeSnippet(key) {
        delete this.snippets[key]
        this.configFile.removeSnippetFromConfigFile(key)
    }

    isChar(keycode) {
        return keycode in charTable
    }

    isModifier(keycode) {
        return [
            29, // L CTRL
            97, // R CTRL
            42, // L SHIFT
            54, // R SHIFT
            56, // L ALT
            100, // R ALT
            3675, // L META
            3676, // R META
        ].includes(keycode)
    }

    isBackspace(keycode) {
        return keycode == 14
    }

    _onKeyUp(e) {
        if (this.isModifier(e.keycode)) {
            return this.modifierPressed = false
        }

        if (this.isBackspace(e.keycode)) {
            return this._shortenBufferBy(1)
        }

        if (this.modifierPressed || ! this.isChar(e.keycode)) {
            return
        }

        this._addCharToBuffer(e.keycode)
        this._shortenBufferIfNecessary()
        this._replaceSnippetIfMatchFound()

        console.log(this.buffer)
    }

    _onKeyDown(e) {
        if (this.isModifier(e.keycode)) {
            this.modifierPressed = true
        }
    }

    _replaceSnippetIfMatchFound() {
        let match = ''
        let snippet = ''

        for (snippet of Object.keys(this.snippets)) {
            if (new RegExp(`.*${snippet}`).test(this.buffer)) {
                match = this.snippets[snippet]
                break
            }
        }

        if (match) {
            for (let i = 0; i < snippet.length; i++) {
                // @todo Press backspace
            }

            console.log(match)

            // @todo Type a `match` as a keyboard
        }
    }

    _addCharToBuffer(keycode) {
        this.buffer += charTable[keycode]
    }

    _shortenBufferBy(amount) {
        this.buffer = this.buffer.substring(0, this.buffer.length - amount)
    }

    _shortenBufferIfNecessary() {
        if (this.buffer.length > 20) {
            this.buffer = this.buffer.substring(1)
        }
    }
}

module.exports = SnippetsManager
