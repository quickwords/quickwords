import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        snippets: [],
        theme: 0,
    },
    mutations: {
        snippets(state, snippets) {
            state.snippets = snippets
        },
        theme(state, theme) {
            state.theme = theme
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
})
