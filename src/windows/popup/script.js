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
    },
    mounted() {
        this.snippets = currentWindow.snippetsManager.snippets
    },
})
