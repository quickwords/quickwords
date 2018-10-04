<template>
    <div class="bg flex h-screen font-sans" :class="['bg-black text-grey-light', 'bg-image text-grey-darkest'][theme]" id="app">
        <div class="flex flex-col flex-2 p-8">
            <h1 class="flex items-center h-12">
                <button
                    @click="$router.push({ name: 'Snippets' })"
                    class="text-2xl text-grey-dark cursor-pointer underline ml-4 px-1 rounded focus:outline-none focus:shadow-outline"
                >Snippets</button>
                <span class="text-3xl ml-4">Preferences</span>
            </h1>
            <div class="mb-8 mt-8 overflow-y-scroll pt-1 flex-1 custom-width-for-shadows px-4 -ml-4">
                <div class="mb-8 flex-1">
                    <label
                        tabindex="0"
                        @keydown.space="changeSection('Manual')"
                        @click="changeSection('Manual')"
                        class="flex justify-between py-4 px-6 h-12 mb-4 items-center rounded cursor-pointer focus:outline-none focus:shadow-outline"
                        :class="['bg-grey-darkest shadow-md', 'bg-grey-light'][theme]"
                        role="button"
                        aria-labelledby="manual_label"
                    >
                        <span id="manual_label" class="select-none flex items-center">
                            <span>Manual</span>
                            <icon-external class="h-4 w-4 -mt-2px ml-1 fill-current"></icon-external>
                        </span>
                    </label>

                    <label
                        tabindex="0"
                        @keydown.space="changeSection(null); theme = (theme === 0) ? 1 : 0"
                        @click="changeSection(null)"
                        class="flex justify-between py-4 px-6 h-12 mb-4 items-center rounded cursor-pointer focus:outline-none focus:shadow-outline"
                        :class="['bg-grey-darkest shadow-md', 'bg-grey-light'][theme]"
                        role="checkbox"
                        aria-labelledby="theme_label"
                        :aria-checked="(theme === 0) ? 'false' : 'true'"
                    >
                        <span id="theme_label" class="select-none">Theme</span>
                        <input type="checkbox" class="invisible" v-model="theme">
                        <div class="w-16 flex rounded overflow-hidden">
                            <div class="w-16 py-1 shadow-inner text-grey-darkest select-none flex-no-shrink text-center bg-blue-light transition" :class="{ '-ml-64': theme }">dark</div>
                            <div class="w-16 py-1 flex-no-shrink select-none text-center bg-grey-dark text-grey-lightest">light</div>
                        </div>
                    </label>

                    <label
                        tabindex="0"
                        @keydown.space="changeSection(null); autoLaunch = !autoLaunch"
                        @click="changeSection(null)"
                        class="flex justify-between py-4 px-6 h-12 mb-4 items-center rounded cursor-pointer focus:outline-none focus:shadow-outline"
                        :class="['bg-grey-darkest shadow-md', 'bg-grey-light'][theme]"
                        role="checkbox"
                        aria-labelledby="autoLaunch_label"
                        :aria-checked="(autoLaunch === true) ? 'true' : 'false'"
                    >
                        <span id="autoLaunch_label" class="select-none" aria-label="Launch at System Startup">Launch at System Startup</span>
                        <input type="checkbox" class="invisible" v-model="autoLaunch">

                        <icon-checkbox v-if="autoLaunch" :checked="true" class="w-6 h-6 text-blue-light fill-current"></icon-checkbox>
                        <icon-checkbox v-else :checked="false" class="w-6 h-6 fill-current"></icon-checkbox>
                    </label>

                    <label
                        tabindex="0"
                        @keydown.space="changeSection(null); autoUpdate = !autoUpdate"
                        @click="changeSection(null)"
                        class="flex justify-between py-4 px-6 h-12 mb-4 items-center rounded cursor-pointer focus:outline-none focus:shadow-outline"
                        :class="['bg-grey-darkest shadow-md', 'bg-grey-light'][theme]"
                        role="checkbox"
                        aria-labelledby="update_label"
                        :aria-checked="(autoUpdate === true) ? 'true' : 'false'"
                    >
                        <span class="select-none" id="update_label" aria-label="Check for Updates">Check for Updates</span>
                        <input type="checkbox" class="invisible" v-model="autoUpdate">

                        <icon-checkbox v-if="autoUpdate" :checked="true" class="w-6 h-6 text-blue-light fill-current"></icon-checkbox>
                        <icon-checkbox v-else :checked="false" class="w-6 h-6 fill-current"></icon-checkbox>
                    </label>

                    <label
                        @click="changeSection(null)"
                        class="flex justify-between py-4 px-6 h-12 mb-4 items-center rounded cursor-pointer"
                        :class="['bg-grey-darkest shadow-md', 'bg-grey-light'][theme]"
                        aria-labelledby="characters_label"
                    >
                        <span id="characters_label" class="select-none">Stored Characters</span>
                        <input
                            type="text"
                            class="px-2 bg-grey-dark flex rounded w-16 text-right h-6 focus:outline-none focus:shadow-outline"
                            :class="['text-black', 'text-grey-lightest'][theme]"
                            @keypress="isNumber(event)"
                            @blur="bufferLengthChanged"
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
    import IconCheckbox from '../../../icons/Checkbox'
    import IconExternal from '../../../icons/External'
    import IconLogo from '../../../icons/Logo'
    import IconLogoMono from '../../../icons/LogoMono'

    import PageManual from './PageManual'
    import PageShortcuts from './PageShortcuts'

    const MAX_BUFFER_LENGTH = 1000
    const MIN_BUFFER_LENGTH = 10

    export default {
        components: {
            IconCheckbox,
            IconExternal,
            IconLogo,
            IconLogoMono,
            PageManual,
            PageShortcuts,
        },
        data() {
            return {
                section: null,
                bufferLength: null,
            }
        },
        created() {
            this.bufferLength = this.$store.getters.bufferLength
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
            autoUpdate: {
                get() {
                    return this.$store.getters.autoUpdate
                },
                set(autoUpdate) {
                    this.$store.commit('autoUpdate', autoUpdate)
                },
            },
        },
        methods: {
            bufferLengthChanged() {
                if (this.bufferLength > MAX_BUFFER_LENGTH) {
                    this.bufferLength = MAX_BUFFER_LENGTH
                } else if (this.bufferLength < MIN_BUFFER_LENGTH) {
                    this.bufferLength = MIN_BUFFER_LENGTH
                }

                this.$store.commit('bufferLength', this.bufferLength)
            },
            changeSection(page) {
                if (page === 'Manual') {
                    this.section = null
                    window.require('electron').remote.shell.openExternal(window.require('../../../../config').config.DOCS_URL)
                } else {
                    this.section = page
                }
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
