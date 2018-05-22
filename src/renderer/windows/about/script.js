import Vue from 'vue'
import { config } from '../../../../config'

const remote = window.require('electron').remote
const store = remote.getCurrentWindow().preferencesManager.store

import Logo from '../../icons/Logo'
import LogoMono from '../../icons/LogoMono'

new Vue({
    el: '#app',
    data() {
        return {
            config,
            theme: store.get('theme'),
        }
    },
    components: {
        IconLogo: Logo,
        IconLogoMono: LogoMono,
    },
    mounted() {
        document.querySelectorAll('a').forEach(el => el.addEventListener('click', e => {
            e.preventDefault()

            remote.shell.openExternal(el.getAttribute('href'))
        }))
    },
})
