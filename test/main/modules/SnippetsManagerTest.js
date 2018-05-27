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

        it('errors a Promise that takes longer than 5 seconds', async function () {
            this.timeout(7000)

            const code = `
                (function () {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => resolve('value'), 6000)
                    })
                })
            `

            try {
                await snippetsManager._evaluate('abcd', code)
            } catch (err) {
                assert.equal('Promise timed out after 5 seconds of inactivity', err)
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
