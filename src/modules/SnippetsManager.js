const ioHook = require('iohook')
const charTable = require('./charTable')
const path = require('path')
const fs = require('fs')
const os = require('os')
const configFile = path.join(os.homedir(), 'Library/Application Support/Quickwords', 'snippets.json')

class SnippetsManager {
    constructor() {
        this.loadSnippetsFromFile()

        this.buffer = ''
        this.modifierPressed = false

        ioHook.on('keydown', e => this.onKeyDown(e))
        ioHook.on('keyup', e => this.onKeyUp(e))

        ioHook.start()
    }

    onKeyUp(e) {
        if (this.isModifier(e.keycode)) {
            return this.modifierPressed = false
        }

        if (this.isBackspace(e.keycode)) {
            return this.shortenBufferBy(1)
        }

        if (this.modifierPressed || ! this.isChar(e.keycode)) {
            return
        }

        this.addCharToBuffer(e.keycode)
        this.shortenBufferIfNecessary()
        this.replaceSnippetIfMatchFound()

        console.log(this.buffer)
    }

    onKeyDown(e) {
        if (this.isModifier(e.keycode)) {
            this.modifierPressed = true
        }
    }

    replaceSnippetIfMatchFound() {
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

    addSnippet(key, value) {
        this.snippets[key] = value
        this.addSnippetToConfigFile(key, value)
    }

    loadSnippetsFromFile() {
        this.createConfigFileIfNecessary()

        this.snippets = this.readConfigFile()

        console.log(this.snippets)
    }

    createConfigFileIfNecessary() {
        if (! fs.existsSync(configFile)) {
            fs.writeFileSync(configFile, '{}', {
                encoding: 'utf8',
            })
        }
    }

    readConfigFile() {
        return JSON.parse(fs.readFileSync(configFile, {
            encoding: 'utf8',
        }))
    }

    addSnippetToConfigFile(key, value) {
        const contents = this.readConfigFile()

        contents[key] = value

        this.writeToConfigFile(contents)
    }

    writeToConfigFile(content) {
        fs.writeFileSync(configFile, JSON.stringify(content), {
            encoding: 'utf8',
        })
    }

    addCharToBuffer(keycode) {
        this.buffer += charTable[keycode]
    }

    shortenBufferBy(amount) {
        this.buffer = this.buffer.substring(0, this.buffer.length - amount)
    }

    shortenBufferIfNecessary() {
        if (this.buffer.length > 20) {
            this.buffer = this.buffer.substring(1)
        }
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
}

module.exports = SnippetsManager
