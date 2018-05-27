const assert = require('assert')
const mock = require('mock-require')

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

const SnippetsManager = require('../../../src/main/modules/SnippetsManager')
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
                    throw new Error('_evaluate did not inform of a syntax error')
                })
                .catch((err) => {
                    assert.equal('Syntax error in the snippet code', err)
                })
        })

        it.only('errors a script with call to undefined function', function () {
            const code = `
                (function () {
                    alert('abcd')
                })
            `

            return snippetsManager._evaluate('abcd', code)
                .then(() => {
                    throw new Error('_evaluate did not inform of a call to undefined function')
                })
                .catch((err) => {
                    assert.equal('blah', err)
                })
        })
    })
})
