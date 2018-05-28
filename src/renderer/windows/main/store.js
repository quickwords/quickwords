import Vue from 'vue'
import Vuex from 'vuex'

const { enableAutoLaunch, disableAutoLaunch, store, enableAutoUpdate, disableAutoUpdate } = window.require('electron').remote.getCurrentWindow().preferencesManager

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        snippets: null, // array
        theme: null, // int
        autoLaunch: null, // bool
        bufferLength: null,
        autoUpdate: null,
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

            if (autoLaunch) {
                enableAutoLaunch()
            } else {
                disableAutoLaunch()
            }
        },
        autoUpdate(state, autoUpdate) {
            state.autoUpdate = autoUpdate
            store.set('autoUpdate', autoUpdate)

            if (autoUpdate) {
                enableAutoUpdate()
            } else {
                disableAutoUpdate()
            }
        },
        bufferLength(state, bufferLength) {
            state.bufferLength = bufferLength
            store.set('bufferLength', bufferLength)
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
        autoUpdate(state) {
            return state.autoUpdate
        },
        bufferLength(state) {
            return state.bufferLength
        },
    },
    actions: {
        init({ commit }) {
            commit('snippets', store.get('snippets'))
            commit('theme', store.get('theme'))
            commit('autoLaunch', store.get('autoLaunch'))
            commit('bufferLength', store.get('bufferLength'))
            commit('autoUpdate', store.get('autoUpdate'))
        },
    },
})
