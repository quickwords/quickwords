import Vue from 'vue'
import Vuex from 'vuex'

const store = window.require('electron').remote.getCurrentWindow().preferencesManager.store

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        snippets: null, // array
        theme: null, // int
        autoLaunch: null, // bool
    },
    mutations: {
        snippets(state, snippets) {
            state.snippets = snippets
            store.set('snippets', snippets)
        },
        theme(state, theme) {
            state.theme = theme
            store.set('theme', theme)
        },
        autoLaunch(state, autoLaunch) {
            state.autoLaunch = autoLaunch
            store.set('autoLaunch', autoLaunch)
        },
    },
    getters: {
        snippets(state) {
            return state.snippets
        },
        theme(state) {
            return state.theme
        },
        autoLaunch(state) {
            return state.autoLaunch
        },
    },
    actions: {
        init({ commit }) {
            commit('snippets', store.get('snippets'))
            commit('theme', store.get('theme'))
            commit('autoLaunch', store.get('autoLaunch'))
        },
    },
})
