const Vue = require('vue/dist/vue')
const { remote } = require('electron')
const currentWindow = remote.getCurrentWindow()

/* eslint "no-unused-vars": "off" */
const vm = new Vue({
    el: '#app',
    data() {
        return {
            isAttached: true,
            editing: {},
            snippets: [],
            error: '',
        }
    },
    watch: {
        editing: {
            handler(newValue, oldValue) {
                if (newValue.id !== oldValue.id) {
                    return
                }

                if (this.editing.type === 'js' && ! this.editing.value) {
                    this.editing.value = 'function (trigger) {\n  return trigger.toUpperCase()\n}'
                }

                this.validateInput()

                if (! this.error) {
                    this.snippets = this.snippets.map(snippet => (snippet.id === this.editing.id) ? this.editing : snippet)

                    currentWindow.snippetsManager.updateSnippets(this.snippets)
                }
            },
            deep: true,
        },
    },
    methods: {
        validateInput() {
            if (this.editing.type === 'js') {
                let response

                try {
                    response = eval(`(${this.editing.value})`)
                } catch (e) {
                    return this.error = e
                }

                if ((typeof response !== 'function') || (typeof response('abc') !== 'string')) {
                    return this.error = 'JS code must be a callable that returns a string.'
                }
            }

            this.error = ''
        },
        moved() {
            this.isAttached = false
        },
        attached() {
            this.isAttached = true
        },
        edit(snippet) {
            this.editing = snippet
        },
        updateSnippets(snippets) {
            this.snippets = snippets
        },
        contextMenu(e) {
            e.preventDefault()

            remote.Menu.buildFromTemplate([
                { label: 'Undo', role: 'undo' },
                { label: 'Redo', role: 'redo' },
                { type: 'separator' },
                { label: 'Cut', role: 'cut' },
                { label: 'Copy', role: 'copy' },
                { label: 'Paste', role: 'paste' },
                { label: 'Select All', role: 'selectAll' },
            ]).popup(currentWindow)
        },
    },
    mounted() {
        this.snippets = currentWindow.snippetsManager.snippets
    },
})
