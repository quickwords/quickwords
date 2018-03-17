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

        robot.setKeyboardDelay(0)

        ioHook.on('keydown', e => this._onKeyDown(e))
        ioHook.on('keyup', e => this._onKeyUp(e))

        ioHook.start()
    }

    destructor() {
        ioHook.unload()
        ioHook.stop()
    }

    getSnippet(key) {
        return this.snippets.filter(snippet => snippet.key === key)[0]
    }

    addSnippet(key, value) {
        this.snippets.map(snippet => {
            if (snippet.key === key) {
                snippet.value = value
            }
            return snippet
        })

        this._writeToFile(this.snippets)
    }

    removeSnippet(key) {
        this.snippets = this.snippets.filter(snippet => snippet.key !== key)
        this._writeToFile(this.snippets)
    }

    updateSnippets(snippets) {
        console.log(snippets)
        this.snippets = snippets
        this._writeToFile(this.snippets)
        // this.propagateSnippetsToViews()
    }

    updateSnippet(snippet) {
        console.log(snippet)
        this.snippets = this.snippets.map(s => (s.key === snippet.key) ? snippet : s)
        this._writeToFile(this.snippets)
        // this.propagateSnippetsToViews()
    }

    // propagateSnippetsToViews() {
    //     const preferencesWindow = require('../windows/preferences')
    //     const popupWindow = require('../windows/popup')

    //     preferencesWindow.ctx.webContents.executeJavaScript(`vm.reloadSnippets();`)
    //     popupWindow.ctx.webContents.executeJavaScript(`vm.reloadSnippet();`)
    // }

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
        const snippet = this.snippets.filter(snippet => new RegExp(`.*${snippet.key}$`, 'i').test(this.buffer))[0]

        if (snippet) {
            for (let i = 0; i < snippet.key.length; i++) {
                robot.keyTap('backspace')
            }

            const clipboardContent = clipboard.readText()

            clipboard.writeText(snippet.value)

            setTimeout(() => robot.keyTap('v', 'command'), 50)
            setTimeout(() => clipboard.writeText(clipboardContent), 500)
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
