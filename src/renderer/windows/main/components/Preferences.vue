<template>
    <div class="bg flex h-screen font-sans" :class="['bg-black text-grey-light', 'bg-image text-grey-darkest'][theme]" id="app">
        <div class="flex flex-col flex-2 p-8">
            <h1 class="flex items-center h-12">
                <router-link :to="{ name: 'Snippets' }" class="text-2xl text-grey-dark cursor-pointer no-underline">Snippets</router-link>
                <span class="text-3xl ml-4">Preferences</span>
            </h1>
            <div class="mb-8 mt-8 overflow-y-scroll flex-1 padding-for-scrollbar">
                <div class="mb-8 flex-1">
                    <label
                        @click="changeSection('Manual')"
                        class="flex justify-between py-4 px-6 h-12 mb-4 items-center rounded cursor-pointer"
                        :class="['bg-grey-darkest', 'bg-grey-light'][theme]"
                    >
                        <span class="select-none">Manual</span>
                    </label>

                    <label
                        @click="changeSection('Shortcuts')"
                        class="flex justify-between py-4 px-6 h-12 mb-4 items-center rounded cursor-pointer"
                        :class="['bg-grey-darkest', 'bg-grey-light'][theme]"
                    >
                        <span class="select-none">Shortcuts</span>
                    </label>

                    <label
                        @click="changeSection(null)"
                        class="flex justify-between py-4 px-6 h-12 mb-4 items-center rounded cursor-pointer"
                        :class="['bg-grey-darkest', 'bg-grey-light'][theme]"
                    >
                        <span class="select-none">Theme</span>
                        <input type="checkbox" class="invisible" v-model="theme">
                        <div class="w-16 flex rounded overflow-hidden">
                            <div class="w-16 py-1 shadow-inner text-grey-darkest select-none flex-no-shrink text-center bg-blue-light transition" :class="{ '-ml-64': theme }">dark</div>
                            <div class="w-16 py-1 flex-no-shrink select-none text-center bg-grey-dark text-grey-lightest">light</div>
                        </div>
                    </label>

                    <label
                        @click="changeSection(null)"
                        class="flex justify-between py-4 px-6 h-12 mb-4 items-center rounded cursor-pointer"
                        :class="['bg-grey-darkest', 'bg-grey-light'][theme]"
                    >
                        <span class="select-none">Launch at system startup</span>
                        <input type="checkbox" class="invisible" v-model="autoLaunch">

                        <icon-checkbox v-if="autoLaunch" :checked="true" class="w-6 h-6 text-blue-light fill-current"></icon-checkbox>
                        <icon-checkbox v-else :checked="false" class="w-6 h-6 fill-current"></icon-checkbox>
                    </label>

                    <label
                        @click="changeSection(null)"
                        class="flex justify-between py-4 px-6 h-12 mb-4 items-center rounded cursor-pointer"
                        :class="['bg-grey-darkest', 'bg-grey-light'][theme]"
                    >
                        <span class="select-none">Stored characters</span>
                        <input
                            type="text"
                            class="px-2 bg-grey-dark shadow-inner-normal flex rounded w-16 text-right outline-none"
                            :class="['text-black', 'text-grey-lightest'][theme]"
                            @keypress="isNumber(event)"
                            v-model.number="bufferLength"
                        >
                    </label>
                </div>
            </div>
        </div>
        <div class="flex-3 p-8 flex flex-col relative shadow-lg" :class="section ? 'active' : ''">
            <div class="flex-1 mb-16 editing">
                <page-manual v-if="section === 'Manual'"></page-manual>
                <page-shortcuts v-if="section === 'Shortcuts'"></page-shortcuts>
            </div>
            <div class="flex justify-center items-center logo" @click="edit(null)" :class="{ 'cursor-pointer': section !== null }">
                <div class="w-full" :class="['opacity-25', ''][theme]">
                    <icon-logo-mono v-if="theme === 0"></icon-logo-mono>
                    <icon-logo v-else></icon-logo>
                </div>
            </div>
            <div class="h-12"></div>
        </div>
    </div>
</template>

<script>
    import Checkbox from '../../../icons/Checkbox'
    import Logo from '../../../icons/Logo'
    import LogoMono from '../../../icons/LogoMono'

    import PageManual from './PageManual'
    import PageShortcuts from './PageShortcuts'

    const MAX_BUFFER_LENGTH = 1000

    export default {
        components: {
            IconCheckbox: Checkbox,
            IconLogo: Logo,
            IconLogoMono: LogoMono,
            PageManual,
            PageShortcuts,
        },
        data() {
            return {
                section: null,
            }
        },
        computed: {
            theme: {
                get() {
                    return this.$store.getters.theme
                },
                set(theme) {
                    this.$store.commit('theme', theme ? 1 : 0)
                },
            },
            autoLaunch: {
                get() {
                    return this.$store.getters.autoLaunch
                },
                set(autoLaunch) {
                    this.$store.commit('autoLaunch', autoLaunch)
                },
            },
            bufferLength: {
                get() {
                    return this.$store.getters.bufferLength
                },
                set(bufferLength) {
                    if (bufferLength > MAX_BUFFER_LENGTH) {
                        bufferLength = MAX_BUFFER_LENGTH
                    }

                    this.$store.commit('bufferLength', bufferLength)
                },
            },
        },
        methods: {
            changeSection(page) {
                this.section = page
            },
            isNumber(e) {
                if ((e.keyCode > 31 && (e.keyCode < 48 || e.keyCode > 57))) {
                    e.preventDefault()

                    return false
                }

                return true
            },
        },
    }
</script>
