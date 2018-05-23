import Vue from 'vue'
import App from './App'

import router from './router'
import store from './store'

window.vm = new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    router,
    store,
})
