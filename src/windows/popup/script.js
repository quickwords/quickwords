const Vue = require('vue/dist/vue')
const electron = require('electron')
const currentWindow = electron.remote.getCurrentWindow()

const vm = new Vue({
    el: '#app',
    data() {
        return {
            isAttached: true,
            editing: {},
            snippets: [],
        }
    },
    watch: {
        editing: {
            handler(newValue, oldValue) {
                if (newValue.id !== oldValue.id) {
                    return
                }

                if (this.editing.type === 'js' && ! this.editing.value) {
                    this.editing.value = `function (trigger) {\n  return trigger.toUpperCase()\n}`
                }

                this.snippets = this.snippets.map(snippet => (snippet.id === this.editing.id) ? this.editing : snippet)

                console.log('updating', this.snippets)
                currentWindow.snippetsManager.updateSnippets(this.snippets)
            },
            deep: true,
        },
    },
    methods: {
        moved() {
            this.isAttached = false
        },
        attached() {
            this.isAttached = true
        },
        edit(snippet) {
            console.log(snippet)
            this.editing = snippet
        },
        updateSnippets(snippets) {
            this.snippets = snippets
        },
    },
    mounted() {
        this.snippets = currentWindow.snippetsManager.snippets
    },
})
