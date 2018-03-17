const Vue = require('vue/dist/vue')
const electron = require('electron')
const currentWindow = electron.remote.getCurrentWindow()

const vm = new Vue({
    el: '#app',
    data() {
        return {
            snippets: [],
            autoLaunch: currentWindow.preferencesManager.getCurrentState(),
        }
    },
    watch: {
        autoLaunch() {
            if (this.autoLaunch === true) {
                currentWindow.preferencesManager.enableAutoLaunch()
            } else {
                currentWindow.preferencesManager.disableAutoLaunch()
            }
        },
    },
    methods: {
        // @todo move to the popup
        contextMenu(e) {
            // e.preventDefault()

            // electron.remote.Menu.buildFromTemplate([
            //     { label: 'Undo', role: 'undo' },
            //     { label: 'Redo', role: 'redo' },
            //     { type: 'separator' },
            //     { label: 'Cut', role: 'cut' },
            //     { label: 'Copy', role: 'copy' },
            //     { label: 'Paste', role: 'paste' },
            //     { label: 'Select All', role: 'selectAll' },
            // ]).popup(currentWindow)
        },
        select(snippet) {
            if (snippet.selected) {
                return snippet.selected = false
            }

            this.unselectAll()

            this.selectNext(snippet)
        },
        selectNext(snippet) {
            snippet.selected = ! snippet.selected
        },
        unselectAll() {
            this.snippets.forEach(snippet => snippet.selected = false)
        },
        add() {
            const snippet = {
                id: Math.floor(Math.random() * (9999999 - 1000000)) + 1000000,
                key: '',
                value:'',
                selected: false,
                regex: false,
                js: false,
            }

            this.snippets.push(snippet)

            this.sendSnippetsToBackend()

            this.showPopup(300, snippet)
        },
        remove() {
            this.snippets = this.snippets.filter(snippet => ! snippet.selected)
            this.sendSnippetsToBackend()
        },
        escapeHandler(e) {
            if (e.key === 'Escape') {
                this.unselectAll()
            }
        },
        showPopup(top, snippet) {
            currentWindow.showPopup(top - this.$refs.rows.scrollTop, snippet)
        },
        updateSnippets(snippets) {
            this.snippets = snippets
        },
        sendSnippetsToBackend() {
            currentWindow.snippetsManager.updateSnippets(this.snippets.map(snippet => {
                snippet.selected = false

                return snippet
            }))
        },
    },
    mounted() {
        this.snippets = JSON.parse(JSON.stringify(currentWindow.snippetsManager.snippets))

        document.addEventListener('keyup', this.escapeHandler)
    },
    unmounted() {
        document.removeEventListener('keyup', this.escapeHandler)
    },
})
