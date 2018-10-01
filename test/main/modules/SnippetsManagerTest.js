const _ = require('lodash')
const assert = require('assert')

const keyboardHandler = {
    on(event, callback) {
        //
    },
    start() {},
    unload() {},
    stop() {},
}

const keyboardSimulator = {
    setKeyboardDelay(delay) {
        //
    },
    keyTap(key, modifier) {
        //
    },
}

const clipboard = {
    readText() {
        //
    },
    writeText() {
        //
    },
}

const store = {
    get(key) {
        //
    },
}

const SnippetsManager = require('../../../out/main/modules/SnippetsManager')
const snippetsManager = new SnippetsManager({ store, keyboardHandler, keyboardSimulator, clipboard })

describe('SnippetsManager', () => {
    describe('constructor', () => {
        it('sets properties and initializes variables', () => {
            const snippetsManager = new SnippetsManager({ store, keyboardHandler, keyboardSimulator, clipboard })

            assert.equal(store, snippetsManager.store)
            assert.equal(keyboardHandler, snippetsManager.keyboardHandler)
            assert.equal(keyboardSimulator, snippetsManager.keyboardSimulator)
            assert.equal(clipboard, snippetsManager.clipboard)

            assert.equal('', snippetsManager.buffer)
            assert.equal(true, snippetsManager.shouldMatch)
            assert.equal(true, _.isNumber(snippetsManager.timeout))
        })

        it('sets keyboard delay to 0', () => {
            let called = false
            let calledWith = null

            const keyboardSimulator = {
                setKeyboardDelay(delay) {
                    called = true
                    calledWith = delay
                },
            }

            const snippetsManager = new SnippetsManager({ store, keyboardHandler, keyboardSimulator, clipboard })

            assert.equal(true, called)
            assert.equal(0, calledWith)
        })

        it('sets keyboard handlers', () => {
            let startCalled = false
            let onWithKeyDownCalledWith = null
            let onWithMouseClickCalledWith = null

            const keyboardHandler = {
                on(event, callback) {
                    if (event === 'keydown') {
                        onWithKeyDownCalledWith = callback
                    }

                    if (event === 'mouseclick') {
                        onWithMouseClickCalledWith = callback
                    }
                },
                start() {
                    startCalled = true
                },
            }

            const snippetsManager = new SnippetsManager({ store, keyboardHandler, keyboardSimulator, clipboard })

            assert.equal(true, _.isFunction(onWithKeyDownCalledWith))
            assert.equal(true, _.isFunction(onWithMouseClickCalledWith))
            assert.equal(true, startCalled)
        })
    })

    describe('destructor', () => {
        it('unhooks iohook', () => {
            let unloadCalled = false
            let stopCalled = false

            const keyboardHandler = {
                on(event, callback) {},
                start() {},
                unload() {
                    unloadCalled = true
                },
                stop() {
                    stopCalled = true
                },
            }

            const snippetsManager = new SnippetsManager({ store, keyboardHandler, keyboardSimulator, clipboard })

            snippetsManager.destructor()

            assert.equal(true, unloadCalled)
            assert.equal(true, stopCalled)
        })
    })

    describe('_isBackspace', () => {
        it('returns true when keycode matches', () => {
            assert.equal(true, snippetsManager._isBackspace(14))
        })

        it('returns false with any other keycode', () => {
            [1, 2, 3].forEach((i) => assert.equal(false, snippetsManager._isBackspace(i)))
        })
    })

    describe('_eventToUnicode', () => {
        it('returns correct unicode value with no modifiers', () => {
            const event = {
                keycode: 30, // A
                shiftKey: false,
                altKey: false,
                ctrlKey: false,
                metaKey: false,
            }

            assert.equal('a', snippetsManager._eventToUnicode(event))
        })

        it('returns correct unicode value with shift pressed', () => {
            const event = {
                keycode: 30, // A
                shiftKey: true,
                altKey: false,
                ctrlKey: false,
                metaKey: false,
            }

            assert.equal('A', snippetsManager._eventToUnicode(event))
        })

        it('returns correct unicode value with alt gr pressed for Polish Pro layout', () => {
            const event = {
                keycode: 30, // A
                shiftKey: false,
                altKey: true,
                ctrlKey: false,
                metaKey: false,
            }

            assert.equal('ą', snippetsManager._eventToUnicode(event))
        })

        it('returns correct unicode value with alt gr and shift pressed for Polish Pro layout', () => {
            const event = {
                keycode: 30, // A
                shiftKey: true,
                altKey: true,
                ctrlKey: false,
                metaKey: false,
            }

            assert.equal('Ą', snippetsManager._eventToUnicode(event))
        })

        it('returns false if ctrl is pressed', () => {
            const event = {
                keycode: 30, // A
                shiftKey: false,
                altKey: false,
                ctrlKey: true,
                metaKey: false,
            }

            assert.equal(false, snippetsManager._eventToUnicode(event))
        })

        it('returns false if meta is pressed', () => {
            const event = {
                keycode: 30, // A
                shiftKey: false,
                altKey: false,
                ctrlKey: false,
                metaKey: true,
            }

            assert.equal(false, snippetsManager._eventToUnicode(event))
        })
    })

    describe('_resetBuffer', () => {
        it('resets the buffer', () => {
            const snippetsManager = new SnippetsManager({ store, keyboardHandler, keyboardSimulator, clipboard })

            snippetsManager.buffer = 'abcd'
            assert.equal('abcd', snippetsManager.buffer)

            snippetsManager._resetBuffer()
            assert.equal('', snippetsManager.buffer)
        })
    })

    describe('_shouldResetBuffer', () => {
        it('returns true if tab was pressed', () => {
            assert.equal(true, snippetsManager._shouldResetBuffer({ keycode: 15 }))
        })

        it('returns true if an arrow was pressed', () => {
            [57416, 57419, 57421, 57424].forEach((arrow) => {
                assert.equal(true, snippetsManager._shouldResetBuffer({ keycode: arrow }))
            })
        })

        it('returns true if a backspace with an alt key was pressed', () => {
            assert.equal(true, snippetsManager._shouldResetBuffer({ keycode: 14, altKey: true }))
        })

        it('returns false if a backspace without an alt key was pressed', () => {
            assert.equal(false, snippetsManager._shouldResetBuffer({ keycode: 14, altKey: false }))
        })
    })

    describe('_onKeyDown', () => {
        it('shortens buffer by one if backspace is pressed', () => {
            snippetsManager.buffer = 'abcd'
            snippetsManager._onKeyDown({ keycode: 14 })
            assert.equal('abc', snippetsManager.buffer)
        })

        it('calls appropriate methods if a key is resolved', () => {
            let _addCharToBufferCalledWith = null
            let _shortenBufferIfNecessaryCalled = false
            let _replaceSnippetIfMatchFoundCalled = false

            snippetsManager._addCharToBuffer = (character) => {
                _addCharToBufferCalledWith = character
            }

            snippetsManager._shortenBufferIfNecessary = () => {
                _shortenBufferIfNecessaryCalled = true
            }

            snippetsManager._replaceSnippetIfMatchFound = () => {
                _replaceSnippetIfMatchFoundCalled = true
            }

            const event = {
                keycode: 30, // A
                shiftKey: false,
                altKey: false,
                ctrlKey: false,
                metaKey: false,
            }

            snippetsManager._onKeyDown(event)

            assert.equal(snippetsManager._eventToUnicode(event), _addCharToBufferCalledWith)
            assert.equal(true, _shortenBufferIfNecessaryCalled)
            assert.equal(true, _replaceSnippetIfMatchFoundCalled)
        })
    })

    describe('_evaluate', () => {
        it('handles a simple js script', async () => {
            const code = `
                (function () {
                    return 'test'
                })
            `

            const result = await snippetsManager._evaluate('abcd', code)

            assert.equal('test', result)
        })

        it('handles a simple js script that requires the trigger', async () => {
            const code = `
                (function (trigger) {
                    return trigger.toUpperCase()
                })
            `

            const result = await snippetsManager._evaluate('abcd', code)

            assert.equal('ABCD', result)
        })

        it('handles a number', async () => {
            const code = `
                (function () {
                    return 10
                })
            `

            const result = await snippetsManager._evaluate('abcd', code)

            assert.equal(10, result)
        })

        it('handles a Promise', async () => {
            const code = `
                (function () {
                    return new Promise((resolve, reject) => {
                        resolve('value')
                    })
                })
            `

            const result = await snippetsManager._evaluate('abcd', code)

            assert.equal('value', result)
        })

        it('errors a Promise that takes longer than the timeout', async function () {
            snippetsManager.timeout = 10

            const code = `
                (function () {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => resolve('value'), 2000)
                    })
                })
            `

            try {
                await snippetsManager._evaluate('abcd', code)
            } catch (err) {
                assert.equal('Function timed out after 5 seconds of inactivity', err)
                return
            }

            throw new Error('_evaluate did not time out')
        })

        it('errors a script with syntax error', function () {
            const code = `
                (function () {
                    retrn 'abcd'
                })
            `

            return snippetsManager._evaluate('abcd', code)
                .then(() => {
                    throw new Error('Exception was expected to be thrown because of syntax error')
                })
                .catch((err) => {
                    assert.equal('SyntaxError: Unexpected string', err)
                })
        })

        it('errors a script with call to undefined function', function () {
            const code = `
                (function () {
                    alert('abcd')
                })
            `

            return snippetsManager._evaluate('abcd', code)
                .then(() => {
                    throw new Error('Exception was expected to be thrown because of a call to undefined function')
                })
                .catch((err) => {
                    assert.equal('ReferenceError: alert is not defined', err)
                })
        })

        it('errors a script with invalid declaration', function () {
            const code = `
                function a() {
                    return 'a'
                }

                function b() {
                    return b
                }
            `

            return snippetsManager._evaluate('abcd', code)
                .then(() => {
                    throw new Error('Exception was expected to be thrown because of invalid syntax')
                })
                .catch((err) => {
                    assert.equal('SyntaxError: Unexpected token function', err)
                })
        })

        it('errors a script when it is not a callable', function () {
            const code = `
                ''.trim()
            `

            return snippetsManager._evaluate('abcd', code)
                .then(() => {
                    throw new Error('Exception was expected to be thrown because provided code is not callable')
                })
                .catch((err) => {
                    assert.equal('Used snippet code is not a function', err)
                })
        })
    })
})
