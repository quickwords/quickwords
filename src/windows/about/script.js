const { shell } = require('electron')
const Vue = require('vue/dist/vue')
const config = require('../../../config')

new Vue({
    el: '#app',
    data() {
        return {
            config: config,
        }
    },
    mounted() {
        document.querySelectorAll('a').forEach(el => el.addEventListener('click', e => {
            e.preventDefault()

            shell.openExternal(el.getAttribute('href'))
        }))
    },
})
