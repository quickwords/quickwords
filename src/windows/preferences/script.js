const Vue = require('vue/dist/vue')
const electron = require('electron')
const currentWindow = electron.remote.getCurrentWindow()

new Vue({
    el: '#app',
    data() {
        return {
            snippets: [],
        }
    },
    watch: {
        snippets: {
            handler() {
                const obj = {}

                this.snippets.forEach(snippet => {
                    if(snippet.key !=='')
                        obj[snippet.key] = snippet.value
                })

                currentWindow.snippetsManager.updateSnippets(obj)
            },
            deep: true,
        },
    },
    methods: {
        select(snippet) {
            if (snippet.selected) return snippet.selected = false

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
            this.snippets.push({
                key: '',
                value:'',
                selected: false,
            })
        },
        remove() {
            this.snippets = this.snippets.filter(snippet => ! snippet.selected)
        },
        escapeHandler(e) {
            if (e.key === 'Escape') {
                this.unselectAll()
            }
        },
        showTextBubble(e) {
            currentWindow.showTextBubble(e.target.offsetTop - document.getElementsByClassName('rows')[0].scrollTop)
        }
    },
    mounted() {
        const snippets = currentWindow.snippetsManager.snippets

        this.snippets = Object.keys(snippets).map(key => ({
            key: key,
            value: snippets[key],
            selected: false,
        }))

        document.addEventListener('keyup', this.escapeHandler)
    },
    unmounted() {
        document.removeEventListener('keyup', this.escapeHandler)
    },
})
