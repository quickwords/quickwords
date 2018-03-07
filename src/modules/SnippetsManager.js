const { clipboard } = require('electron')
const ioHook = require('iohook')
const charTable = require('./charTable')
const ConfigFileManager = require('./ConfigFileManager')
const robot = require('robotjs')

class SnippetsManager {
    constructor() {
        this.configFile = new ConfigFileManager()
        this.snippets = this.configFile.getSnippets()

        this.buffer = ''
        this.modifierPressed = false
        this.shouldMatch = true

        ioHook.on('keydown', e => this._onKeyDown(e))
        ioHook.on('keyup', e => this._onKeyUp(e))

        ioHook.start()
    }

    destructor() {
        ioHook.unload()
        ioHook.stop()
    }

    addSnippet(key, value) {
        this.snippets[key] = value
        this.configFile.addSnippet(key, value)
    }

    removeSnippet(key) {
        delete this.snippets[key]
        this.configFile.removeSnippet(key)
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

    updateSnippets(snippets) {
        this.snippets = snippets
        this.configFile._writeToFile(snippets)
    }

    _onKeyUp(e) {
        if (! this.shouldMatch) {
            return
        }

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
            if (new RegExp(`.*${snippet}$`, 'i').test(this.buffer)) {
                match = this.snippets[snippet]
                break
            }
        }

        if (match) {
            for (let i = 0; i < snippet.length; i++) {
                robot.keyTap('backspace')
            }

            const clipboardContent = clipboard.readText()

            clipboard.writeText(match)

            robot.keyTap('v', 'command')

            setTimeout(() => clipboard.writeText(clipboardContent), 1000)
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
