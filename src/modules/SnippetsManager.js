const { clipboard } = require('electron')
const ioHook = require('iohook')
const robot = require('robotjs')
const fs = require('fs')
const chars = require('./chars')
const keymap = require('native-keymap').getKeyMap()
const _ = require('lodash')

const BUFFER_LIMIT = 20 // amount of characters held in memory
const KEY_BACKSPACE = 'Backspace'
const KEY_SHIFT_LEFT = 'ShiftLeft'
const KEY_ALT_LEFT = 'AltLeft'
const KEY_SHIFT_RIGHT = 'ShiftRight'
const KEY_ALT_RIGHT = 'AltRight'
const MODIFIER_NONE = 0
const MODIFIER_SHIFT = 1
const MODIFIER_ALT = 2

class SnippetsManager {
    constructor() {
        this._createFileIfNecessary()
        this.snippets = this._readFile()

        this.buffer = ''
        this.modifier = MODIFIER_NONE
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
    }

    getSnippets() {
        return this.snippets
    }

    isModifier(keycode) {
        return [
            KEY_SHIFT_LEFT,
            KEY_ALT_LEFT,
            KEY_SHIFT_RIGHT,
            KEY_ALT_RIGHT,
        ].includes(this._getCharNameFromKeycode(keycode))
    }

    _getCharNameFromKeycode(keycode) {
        return _.get(chars, keycode, null)
    }

    isBackspace(keycode) {
        return this._getCharNameFromKeycode(keycode) === KEY_BACKSPACE
    }

    _keycodeToUnicode(keycode) {
        const name = this._getCharNameFromKeycode(keycode)

        if (! name || ! (name in keymap)) {
            return false
        }

        let value

        switch (this.modifier) {
            case MODIFIER_ALT:
                value = _.get(keymap, `${name}.withAltGr`, false)
                break
            case MODIFIER_SHIFT:
                value = _.get(keymap, `${name}.withShift`, false)
                break
            case MODIFIER_ALT + MODIFIER_SHIFT:
                value = _.get(keymap, `${name}.withShiftAltGr`, false)
                break
            case MODIFIER_NONE:
                value = _.get(keymap, `${name}.value`, false)
                break
            default:
                // nothing to do here
        }

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
            this._shortenBufferBy(1)
            return
        }

        if (this.isModifier(e.keycode)) {
            // @todo Make a PR to iohook, so that the library returns what
            // modifiers are pressed. Currently I am doing a timeout,
            // but it is NOT scalable/100% working at all.
            setTimeout(() => {
                // console.log('Released modifier: ', chars[e.keycode])

                const modifier = this._getCharNameFromKeycode(e.keycode)

                if (
                    (this.modifier === MODIFIER_SHIFT || this.modifier === MODIFIER_SHIFT + MODIFIER_ALT)
                    && (modifier === 'ShiftLeft' || modifier === 'ShiftRight')
                ) {
                    this.modifier -= MODIFIER_SHIFT
                }

                if (
                    (this.modifier === MODIFIER_ALT || this.modifier === MODIFIER_SHIFT + MODIFIER_ALT)
                    && (modifier === 'AltLeft' || modifier === 'AltRight')
                ) {
                    this.modifier -= MODIFIER_ALT
                }
            }, 50)
            return
        }

        const character = this._keycodeToUnicode(e.keycode)

        if (character) {
            this._addCharToBuffer(character)
            this._shortenBufferIfNecessary()
            this._replaceSnippetIfMatchFound()

            // console.log(character, this.modifier ? ' with a modifier' + this.modifier : '')
        }

        console.log(this.buffer)
    }

    _onKeyDown(e) {
        if (this.isModifier(e.keycode)) {
            // console.log('Pressed modifier: ', chars[e.keycode])

            const modifier = this._getCharNameFromKeycode(e.keycode)

            if (
                this.modifier !== MODIFIER_SHIFT
                && this.modifier !== MODIFIER_SHIFT + MODIFIER_ALT
                && (modifier === 'ShiftLeft' || modifier === 'ShiftRight')
            ) {
                this.modifier += MODIFIER_SHIFT
            }

            if (
                this.modifier !== MODIFIER_ALT
                && this.modifier !== MODIFIER_SHIFT + MODIFIER_ALT
                && (modifier === 'AltLeft' || modifier === 'AltRight')
            ) {
                this.modifier += MODIFIER_ALT
            }
        }
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
