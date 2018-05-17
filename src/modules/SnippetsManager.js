const { clipboard } = require('electron')
const ioHook = require('iohook')
const charTable = require('./charTable')
const robot = require('robotjs')
const fs = require('fs')
const chars = require('./chars')
const keymap = require('native-keymap').getKeyMap()
const _ = require('lodash')

const BUFFER_LIMIT = 20 // amount of characters held in memory
const KEY_BACKSPACE = 'Backspace'

class SnippetsManager {
    constructor() {
        this._createFileIfNecessary()
        this.snippets = this._readFile()

        this.buffer = ''
        this.shouldMatch = true

        robot.setKeyboardDelay(0)

        ioHook.on('keydown', e => this._onKeyDown(e))

        ioHook.start()
    }

    destructor() {
        ioHook.unload()
        ioHook.stop()
    }

    updateSnippets(snippets) {
        this.snippets = snippets
        this._writeToFile(this.snippets)
        this.propagateSnippetsToViews()
    }

    propagateSnippetsToViews() {
        const preferencesWindow = require('../windows/preferences')
        const popupWindow = require('../windows/popup')

        preferencesWindow.ctx.webContents.executeJavaScript(`vm.updateSnippets(${JSON.stringify(this.snippets)});`)
        popupWindow.ctx.webContents.executeJavaScript(`vm.updateSnippets(${JSON.stringify(this.snippets)});`)
    }

    _getCharNameFromKeycode(keycode) {
        return _.get(chars, keycode, null)
    }

    isBackspace(keycode) {
        return this._getCharNameFromKeycode(keycode) === KEY_BACKSPACE
    }

    _eventToUnicode({ keycode, shiftKey, altKey }) {
        const name = this._getCharNameFromKeycode(keycode)

        if (! name || ! (name in keymap)) {
            return false
        }

        let value

        if (shiftKey && altKey) {
            value = _.get(keymap, `${name}.withShiftAltGr`, false)
        } else if (shiftKey) {
            value = _.get(keymap, `${name}.withShift`, false)
        } else if (altKey) {
            value = _.get(keymap, `${name}.withAltGr`, false)
        } else {
            value = _.get(keymap, `${name}.value`, false)
        }

        if (! value) {
            return false
        }

        return value
    }

    _onKeyDown({ keycode, shiftKey, altKey }) {
        if (! this.shouldMatch) {
            return
        }

        if (this.isBackspace(keycode)) {
            this._shortenBufferBy(1)
            return
        }

        const character = this._eventToUnicode({ keycode, shiftKey, altKey })

        if (character) {
            this._addCharToBuffer(character)
            this._shortenBufferIfNecessary()
            this._replaceSnippetIfMatchFound()
        }

        console.log(this.buffer)
    }

    async _evaluate(matchedString, code) {
        'use strict'

        const executable = eval(`(${code})`)

        if (! _.isFunction(executable)) {
            throw new Error('User-provided code is not a function')
        }

        let data = await executable(matchedString)

        if (! _.isString(data)) {
            data = JSON.stringify(data)
        }

        return data
    }

    _replaceSnippetIfMatchFound() {
        for (const snippet of this.snippets) {
            let key = snippet.key

            if (! snippet.regex) {
                // escape all regex-special characters
                key = key.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
            }

            const match = new RegExp(`.*(${key})$`).exec(this.buffer)
            const matchedString = _.get(match, 1, false)

            if (matchedString) {
                for (let i = 0; i < matchedString.length; i++) {
                    robot.keyTap('backspace')
                }

                if (snippet.type === 'js') {
                    this._handleJavascriptSnippet(matchedString, snippet.value)
                } else {
                    this._handlePlainTextSnippet(snippet.value)
                }

                break
            }
        }
    }

    async _handleJavascriptSnippet(matchedString, code) {
        const clipboardContent = clipboard.readText()

        try {
            const data = await this._evaluate(matchedString, code)

            clipboard.writeText(data)
        } catch (error) {
            clipboard.writeText('An error ocurred')
        } finally {
            setTimeout(() => robot.keyTap('v', 'command'), 50)
            setTimeout(() => clipboard.writeText(clipboardContent), 500)
        }
    }

    _handlePlainTextSnippet(value) {
        const clipboardContent = clipboard.readText()

        clipboard.writeText(value)

        setTimeout(() => robot.keyTap('v', 'command'), 50)
        setTimeout(() => clipboard.writeText(clipboardContent), 500)
    }

    _addCharToBuffer(character) {
        this.buffer += character
    }

    _shortenBufferBy(amount) {
        this.buffer = this.buffer.substring(0, this.buffer.length - amount)
    }

    _shortenBufferIfNecessary() {
        if (this.buffer.length > BUFFER_LIMIT) {
            this.buffer = this.buffer.substring(1)
        }
    }

    _createFileIfNecessary() {
        if (! fs.existsSync(process.env.SNIPPETS_PATH)) {
            fs.writeFileSync(process.env.SNIPPETS_PATH, '[]', {
                encoding: 'utf8',
            })
        }
    }

    _readFile() {
        return JSON.parse(fs.readFileSync(process.env.SNIPPETS_PATH, {
            encoding: 'utf8',
        }))
    }

    _writeToFile(content) {
        fs.writeFileSync(process.env.SNIPPETS_PATH, JSON.stringify(content), {
            encoding: 'utf8',
        })
    }
}

module.exports = SnippetsManager
