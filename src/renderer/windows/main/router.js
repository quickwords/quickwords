import Vue from 'vue'
import Router from 'vue-router'

import Preferences from './components/Preferences'
import Snippets from './components/Snippets'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Preferences',
            component: Preferences,
        },
        {
            path: '/snippets',
            name: 'Snippets',
            component: Snippets,
        },
    ],
})
