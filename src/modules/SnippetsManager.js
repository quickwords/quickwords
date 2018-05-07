const { clipboard } = require('electron')
const ioHook = require('iohook')
const charTable = require('./charTable')
const robot = require('robotjs')
const fs = require('fs')
const chars = require('./chars')
const keymap = require('native-keymap').getKeyMap()
const _ = require('lodash')

const BUFFER_LIMIT = 20 // amount of characters held in memory
const KEY_BACKSPACE = 14

class SnippetsManager {
    constructor() {
        this._createFileIfNecessary()
        this.snippets = this._readFile()

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
        return keycode === KEY_BACKSPACE
    }

    _keycodeToUnicode(code) {
        if (! code in chars) {
            return false
        }

        const name = chars[code]

        if (! name in keymap) {
            return false
        }

        const value = _.get(keymap, `${name}.value`, false)

        if (! value) {
            return false
        }

        return value
    }

    _onKeyUp(e) {
        if (! this.shouldMatch) {
            return
        }

        if (this.isBackspace(e.keycode)) {
            return this._shortenBufferBy(1)
        }

        // if (this.isModifier(e.keycode)) {
        //     return this.modifierPressed = false
        // }

        // if (this.modifierPressed || ! this.isChar(e.keycode)) {
        //     return
        // }

        const character = this._keycodeToUnicode(e.keycode)

        if (character) {
            this._addCharToBuffer(character)
            this._shortenBufferIfNecessary()
            this._replaceSnippetIfMatchFound()
        }

        console.log(this.buffer)
    }

    _onKeyDown(e) {
        if (this.isModifier(e.keycode)) {
            this.modifierPressed = true
        }
    }

    async _evaluate(matchedString, code) {
        'use strict'

        const executable = eval(`(${code})`)

        if (! _.isFunction(executable)) {
            throw new Error('User-provided code is not a function')
        }

        return await executable(matchedString)
    }

    _replaceSnippetIfMatchFound() {
        for (const snippet of this.snippets) {
            let key = snippet.key

            if (! snippet.regex) {
                key = key.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') // escape all regex-special characters
            }

            const match = new RegExp(`.*(${key})$`, 'i').exec(this.buffer)
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
