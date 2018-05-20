const { clipboard } = require('electron')
const ioHook = require('iohook')
const robot = require('robotjs')
const fs = require('fs')
const chars = require('./chars')
const keymap = require('native-keymap').getKeyMap()
const _ = require('lodash')
const defaultSnippets = require('./defaultSnippets')

const BUFFER_LIMIT = 20 // amount of characters held in memory
const KEY_BACKSPACE = 'Backspace'
const KEY_ARROWS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
const KEY_TAB = 'Tab'

class SnippetsManager {
    constructor(store) {
        this.store = store
        this.snippets = this.store.get('snippets', defaultSnippets)

        this.buffer = ''
        this.shouldMatch = true

        robot.setKeyboardDelay(0)

        ioHook.on('keydown', e => this._onKeyDown(e))
        ioHook.on('mouseclick', e => this._onMouseClick(e))

        ioHook.start()
        console.log(keymap)
    }

    destructor() {
        ioHook.unload()
        ioHook.stop()
    }

    /** Used by the renderer process */
    updateSnippets(snippets) {
        this.snippets = snippets
        this.store.set('snippets', this.snippets)
    }

    /** Used by the renderer process */
    getSnippets() {
        return this.snippets
    }

    needToResetBuffer(keycode, altKey) {
        const click = this._getCharNameFromKeycode(keycode)

        if (click === KEY_BACKSPACE && altKey === true) { return true }
        else if (click === KEY_TAB) { return true }
        else if (KEY_ARROWS.includes(click)) { return true }

        return false

    }

    isBackspace(keycode) {
        return this._getCharNameFromKeycode(keycode) === KEY_BACKSPACE
    }

    _getCharNameFromKeycode(keycode) {
        return _.get(chars, keycode, null)
    }

    _eventToUnicode({ keycode, shiftKey, altKey }) {
        const name = this._getCharNameFromKeycode(keycode)

        if (!name || !(name in keymap)) {
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

        if (!value) {
            return false
        }

        return value
    }
    _onMouseClick(){
        this.buffer = ''
    }

    _onKeyDown({ keycode, shiftKey, altKey }) {

        if (this.needToResetBuffer(keycode, altKey)) {
            this.buffer = ''
            return
        }

        if (!this.shouldMatch) {
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

        if (!_.isFunction(executable)) {
            throw new Error('User-provided code is not a function')
        }

        let data = await executable(matchedString)

        if (!_.isString(data)) {
            data = JSON.stringify(data)
        }

        return data
    }

    _replaceSnippetIfMatchFound() {
        for (const snippet of this.snippets) {
            let key = snippet.key

            if (!snippet.regex) {
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
}

module.exports = SnippetsManager
