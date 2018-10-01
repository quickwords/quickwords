const chars = require('./chars')
const keymap = require('native-keymap').getKeyMap()
const _ = require('lodash')
const PlatformAware = require('./PlatformAware')

const KEY_BACKSPACE = 'Backspace'
const KEY_ARROWS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
const KEY_TAB = 'Tab'

class SnippetsManager {
    constructor({ store, keyboardHandler, keyboardSimulator, clipboard }) {
        this.store = store
        this.keyboardHandler = keyboardHandler
        this.keyboardSimulator = keyboardSimulator
        this.clipboard = clipboard

        this.buffer = ''
        this.shouldMatch = true
        this.timeout = 5000 // 5 seconds

        this.keyboardSimulator.setKeyboardDelay(0)

        this.keyboardHandler.on('keydown', this._onKeyDown.bind(this))
        this.keyboardHandler.on('mouseclick', this._onMouseClick.bind(this))

        this.keyboardHandler.start()
    }

    destructor() {
        this.keyboardHandler.unload()
        this.keyboardHandler.stop()
    }

    _isBackspace(keycode) {
        return this._getCharNameFromKeycode(keycode) === KEY_BACKSPACE
    }

    _getCharNameFromKeycode(keycode) {
        return _.get(chars, keycode, null)
    }

    _eventToUnicode({ keycode, shiftKey, altKey, ctrlKey, metaKey }) {
        const name = this._getCharNameFromKeycode(keycode)

        if (!name || !(name in keymap)) {
            return false
        }

        let value

        if (shiftKey && altKey && !ctrlKey && !metaKey) {
            value = _.get(keymap, `${name}.withShiftAltGr`, false)
        } else if (shiftKey && !ctrlKey && !metaKey) {
            value = _.get(keymap, `${name}.withShift`, false)
        } else if (altKey && !ctrlKey && !metaKey) {
            value = _.get(keymap, `${name}.withAltGr`, false)
        } else if (!ctrlKey && !metaKey) {
            value = _.get(keymap, `${name}.value`, false)
        } else {
            value = false
        }

        if (!value) {
            return false
        }

        return value
    }

    _resetBuffer() {
        this.buffer = ''
    }

    _onMouseClick() {
        this._resetBuffer()
    }

    _shouldResetBuffer({ keycode, altKey }) {
        const pressed = this._getCharNameFromKeycode(keycode)

        return (pressed === KEY_BACKSPACE && altKey === true)
            || (pressed === KEY_TAB)
            || (KEY_ARROWS.includes(pressed))
    }

    _onKeyDown(e) {
        if (!this.shouldMatch) {
            return
        }

        if (this._shouldResetBuffer(e)) {
            this._resetBuffer()
            return
        }

        if (this._isBackspace(e.keycode)) {
            this._shortenBufferBy(1)
            return
        }

        const character = this._eventToUnicode(e)

        if (character) {
            this._addCharToBuffer(character)
            this._shortenBufferIfNecessary()
            this._replaceSnippetIfMatchFound()
        }
    }

    _evaluate(matchedString, code) {
        return new Promise((resolve, reject) => {
            'use strict'

            const timeout = setTimeout(() => reject('Function timed out after 5 seconds of inactivity'), this.timeout)

            let executable

            try {
                executable = eval(`
                    const fetch = require('node-fetch');
                    const exec = require('child_process').exec;
                    (${code})
                `)
            } catch (err) {
                reject(String(err))
            }

            if (!_.isFunction(executable)) {
                reject('Used snippet code is not a function')
            }

            const r = (data) => {
                clearTimeout(timeout)

                resolve(data)
            }

            let e

            try {
                e = executable(matchedString)
            } catch (err) {
                reject(err)
            }

            if (_.isObject(e) && _.isFunction(e.then)) {
                e.then(r).catch(reject)
            } else if (_.isString(e) || _.isNumber(e)) {
                r(e)
            } else {
                reject('User-defined function returned invalid type. Expected a Promise, string or number.')
            }
        })
    }

    _replaceSnippetIfMatchFound() {
        for (const snippet of this.store.get('snippets')) {
            let key = snippet.key

            if (!snippet.regex) {
                // escape all regex-special characters
                key = _.escapeRegExp(key)
            }

            const match = new RegExp(`.*(${key})$`).exec(this.buffer)
            const matchedString = _.get(match, 1, false)

            if (matchedString) {
                for (let i = 0; i < matchedString.length; i++) {
                    this.keyboardSimulator.keyTap('backspace')
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
        const clipboardContent = this.clipboard.readText()

        try {
            const data = await this._evaluate(matchedString, code)

            this.clipboard.writeText(data)
        } catch (error) {
            this.clipboard.writeText(`QWError: ${_.get('error', 'message', String(error))}`)
        } finally {
            setTimeout(() => this.paste(), 50)
            setTimeout(() => this.clipboard.writeText(clipboardContent), 500)
        }
    }

    paste() {
        if (PlatformAware.mac()) {
            this.keyboardSimulator.keyTap('v', 'command')
        } else {
            this.keyboardSimulator.keyTap('v', 'control')
        }
    },

    _handlePlainTextSnippet(value) {
        const clipboardContent = this.clipboard.readText()

        this.clipboard.writeText(value)

        setTimeout(() => this.keyboardSimulator.keyTap('v', 'command'), 50)
        setTimeout(() => this.clipboard.writeText(clipboardContent), 500)
    }

    _addCharToBuffer(character) {
        this.buffer += character
    }

    _shortenBufferBy(amount) {
        this.buffer = this.buffer.substring(0, this.buffer.length - amount)
    }

    _shortenBufferIfNecessary() {
        if (this.buffer.length > this.store.get('bufferLength')) {
            this.buffer = this.buffer.substring(1)
        }
    }
}

module.exports = SnippetsManager
