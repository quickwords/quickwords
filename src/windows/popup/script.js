const Vue = require('vue/dist/vue')
// const electron = require('electron')
// const currentWindow = electron.remote.getCurrentWindow()

const vm = new Vue({
    el: '#app',
    data() {
        return {
            isAttached: true,
            snippet: null,
        }
    },
    methods: {
        moved() {
            this.isAttached = false
        },
        attached() {
            this.isAttached = true
        },
        setSnippet(snippet) {
            console.log(snippet)
            this.snippet = snippet
        },
    },
})
