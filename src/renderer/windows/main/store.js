import Vue from 'vue'
import Vuex from 'vuex'

const store = window.require('electron').remote.getCurrentWindow().preferencesManager.store

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        snippets: [],
        theme: 0,
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
    },
    getters: {
        snippets(state) {
            return state.snippets
        },
        theme(state) {
            return state.theme
        },
    },
    actions: {
        init({ commit }) {
            commit('snippets', store.get('snippets'))
            commit('theme', store.get('theme'))
        },
    },
})
