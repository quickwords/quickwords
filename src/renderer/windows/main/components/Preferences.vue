<template>
    <div>
        Preferences

        <router-link :to="{ name: 'Snippets' }">Snippets</router-link>

        <input type="radio" name="theme" :value="0" v-model="theme"> theme 0
        <input type="radio" name="theme" :value="1" v-model="theme"> theme 1
    </div>
</template>

<script>
    export default {
        computed: {
            theme: {
                get() {
                    return this.$store.getters.theme
                },
                set(theme) {
                    this.$store.commit('theme', theme)
                },
            },
        },
    }
</script>
