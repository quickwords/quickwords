<template>
    <div class="bg flex h-screen font-sans" :class="['bg-black text-grey-light', 'bg-image text-grey-darkest'][theme]" id="app">
        <div class="flex flex-col flex-2 p-8">
            <h1 class="flex items-center h-12">
                <span class="flex-1">
                    <span class="text-3xl">Snippets</span>
                    <router-link :to="{ name: 'Preferences' }" class="text-2xl text-grey-dark cursor-pointer no-underline ml-4 focus:outline-none focus:shadow-outline" tabindex="1">Preferences</router-link>
                </span>
            </h1>
            <div class="mt-4 flex">
                <input
                    type="text"
                    placeholder="Search..."
                    v-model="searchSnippets"
                    class="rounded flex-1 py-2 px-4 focus:outline-none focus:shadow-outline"
                    :class="['bg-black-light text-grey-light border border-black-darkest', 'border text-grey-darkest'][theme]"
                    tabindex="2"
                >
                <!-- <span class="ml-4 font-bold w-6 flex items-center justify-center cursor-pointer">A</span> -->
                <!-- <span class="ml-4 font-bold w-6 flex items-center justify-center cursor-pointer">↓</span> -->
            </div>
            <div class="mb-8 mt-8 overflow-y-scroll overflow-x-visible flex-1 custom-width-for-shadows px-4 pt-1 -ml-4" ref="list">
                <div
                    class="w-full items-center justify-between h-12 flex pt-4 pb-3 px-6 mb-4 rounded cursor-pointer clickable border-b-4 border-transparent focus:outline-none focus:shadow-outline"
                    :class="{
                        'bg-grey-darkest shadow-md': theme === 0,
                        'bg-grey-light': theme === 1,
                        'border-white': editing && editing.id === snippet.id && theme === 0,
                        'border-brand-blue': editing && editing.id === snippet.id && theme === 1,
                    }"
                    role="button"
                    tabindex="0"
                    v-for="snippet in filteredSnippets"
                    :key="snippet.id"
                    @keydown.space="edit(snippet)"
                    @click="edit(snippet)"
                >
                    <span class="flex-1">{{ snippet.key }}</span>
                    <span class="px-3 ml-2 text-grey-darkest py-1 text-xs bg-grey rounded-full" v-if="snippet.regex">regex</span>
                    <span class="px-3 ml-2 text-grey-darkest py-1 text-xs bg-grey rounded-full" v-if="snippet.type === 'js'">js</span>
                    <button type="button" tabindex="0" class="flex items-center ml-2 rounded-full focus:outline-none focus:shadow-outline" :class="['text-grey-light', 'text-grey-darkest'][theme]" @click.stop="remove(snippet)">
                        <icon-remove class="h-6 w-6 fill-current"></icon-remove>
                    </button>
                </div>
            </div>
            <div class="flex justify-end">
                <button type="button" class="flex items-center justify-center w-8 h-8 rounded-full focus:outline-none focus:shadow-outline" :class="['text-grey-light', 'text-grey-darkest'][theme]" @click="add" title="Add snippet" tabindex="3">
                    <icon-plus class="fill-current w-full h-full"></icon-plus>
                </button>
            </div>
        </div>
        <div class="flex-3 p-8 flex flex-col relative shadow-lg" :class="editing ? 'active' : ''">
            <div class="flex-1 mb-16 editing">
                <div v-if="editing" class="flex flex-col h-full">
                    <div class="flex mb-4">
                        <input
                            class="rounded p-4 mr-4 flex-1"
                            :class="['bg-grey-darkest text-grey-lightest', 'border text-grey-darkest'][theme]"
                            type="text"
                            placeholder="Trigger"
                            v-model="editing.key"
                            v-focus
                        >
                        <label tabindex="0" for="regex" @keydown.space="editing.regex = !editing.regex" class="flex justify-center items-center cursor-pointer">
                            <input type="checkbox" id="regex" class="invisible" v-model="editing.regex">
                            <div class="mr-2">
                                <icon-checkbox
                                    v-if="editing.regex"
                                    :checked="true"
                                    class="text-brand-blue fill-current w-6 h-6"
                                ></icon-checkbox>
                                <icon-checkbox
                                    v-else
                                    :checked="false"
                                    class="fill-current w-6 h-6"
                                    :class="['text-grey-lightest', 'text-grey-darkest'][theme]"
                                ></icon-checkbox>
                            </div>

                            Use Regular Expression
                        </label>
                    </div>
                    <div class="relative flex flex-col flex-1 mb-4">
                        <textarea
                            class="rounded flex-1 p-4 text-grey-darkest resize-none font-sans"
                            placeholder="Substitute with..."
                            v-model="editing.value"
                            @keydown="save"
                            :class="['bg-grey-darkest text-grey-lightest', 'border'][theme]"
                            v-if="editing.type === 'plain'"
                        ></textarea>
                        <editor
                            class="rounded flex-1"
                            @edit="(value) => editing.value = value"
                            :theme="theme === 0 ? 'qw_dark' : 'chrome'"
                            :mode="editing.type === 'js' ? 'javascript' : 'text'"
                            ref="editor"
                            v-else
                        ></editor>
                        <emoji-picker @emoji="append" :search="searchEmojis" v-if="editing.type === 'plain'">
                            <div
                                class="absolute t-4 r-4 h-8 w-8 cursor-pointer emoji-invoker rounded-full focus:outline-none focus:shadow-outline"
                                :class="['text-grey', ''][theme]"
                                slot="emoji-invoker"
                                slot-scope="{ events }"
                                v-on="events"
                                tabindex="0"
                                @keydown.space="events.click"
                            >
                                <icon-face class="h-8 w-8 fill-current"></icon-face>
                            </div>
                            <div slot="emoji-picker" slot-scope="{ emojis, insert, display }">
                                <div
                                    class="absolute z-10 w-64 h-96 overflow-scroll p-4 rounded shadow t-6 r-6"
                                    :class="['bg-grey-dark', 'border bg-grey-lightest'][theme]"
                                >
                                    <div class="flex">
                                        <input
                                            class="flex-1 rounded-full py-2 px-4"
                                            :class="['bg-grey', 'bg-white border'][theme]"
                                            type="text"
                                            v-model="searchEmojis"
                                            v-focus
                                        >
                                    </div>
                                    <div>
                                        <div v-for="(emojiGroup, category) in emojis" :key="category">
                                            <h5
                                                class="uppercase text-sm cursor-default mb-2 mt-4"
                                                :class="['text-grey-darkest', 'text-grey-darker'][theme]"
                                            >
                                                {{ category }}
                                            </h5>
                                            <div class="flex flex-wrap justify-between emojis">
                                                <span
                                                    class="p-1 cursor-pointer rounded hover:bg-grey-light flex items-center justify-center"
                                                    v-for="(emoji, emojiName) in emojiGroup"
                                                    @click="insert(emoji)"
                                                    :key="emojiName"
                                                    :title="emojiName"
                                                >{{ emoji }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </emoji-picker>
                        <div class="absolute pin-r pin-b p-4 text-grey-darker text-sm pointer-events-none">
                            <span class="relative" :class="(statusVisible) ? 'status-visible' : 'status-hidden'">{{ status }}</span>
                        </div>
                    </div>
                    <div class="relative flex">
                        <select
                            tabindex="0"
                            v-model="editing.type"
                            class="p-4 rounded flex-1"
                            :class="['bg-grey-darkest shadow-md text-grey-lightest', 'border'][theme]"
                            @change="changedType"
                        >
                            <option value="plain">Plain Text</option>
                            <option value="js">JavaScript</option>
                        </select>
                        <icon-arrow-down class="block absolute center-y r-4 w-8 h-8 fill-current text-grey-dark"></icon-arrow-down>
                    </div>
                </div>
                <div class="flex flex-col h-full" v-else>
                    <input
                        :class="['bg-grey-darkest text-grey-lightest', 'border'][theme]"
                        class="mb-4 p-4"
                        type="text"
                        placeholder="Trigger"
                    >
                    <textarea
                        :class="['bg-grey-darkest text-grey-lightest', 'border'][theme]"
                        class="flex-1 p-4"
                        placeholder="Substitute with..."
                    ></textarea>
                </div>
            </div>
            <div class="flex justify-center items-center logo" @click="edit(null)" :class="{ 'cursor-pointer': editing !== null }">
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
    import Vue from 'vue'
    import _ from 'lodash'
    import Editor from './Editor'
    import EmojiPicker from 'vue-emoji-picker'

    import IconArrowDown from '../../../icons/ArrowDown'
    import IconCheckbox from '../../../icons/Checkbox'
    import IconFace from '../../../icons/Face'
    import IconLogo from '../../../icons/Logo'
    import IconLogoMono from '../../../icons/LogoMono'
    import IconPlus from '../../../icons/Plus'
    import IconRemove from '../../../icons/Remove'

    export default {
        components: {
            Editor,
            EmojiPicker,
            IconArrowDown,
            IconCheckbox,
            IconFace,
            IconLogo,
            IconLogoMono,
            IconPlus,
            IconRemove,
        },
        data() {
            return {
                editing: null,
                searchEmojis: '',
                searchSnippets: '',
                status: 'Saving...',
                statusVisible: false,
                snippets: [],
            }
        },
        computed: {
            theme: {
                get() {
                    return this.$store.getters.theme
                },
                set(theme) {
                    this.$store.commit('theme', theme)
                },
            },
            filteredSnippets() {
                if (!this.searchSnippets) {
                    return this.snippets
                }

                const regex = new RegExp(`.*${this.searchSnippets}.*`, 'i')

                return this.snippets.filter((snippet) => regex.test(snippet.key) || regex.test(snippet.value))
            },
        },
        watch: {
            snippets: {
                handler() {
                    this.$store.commit('snippets', this.snippets)
                },
                deep: true,
            },
        },
        methods: {
            edit(snippet) {
                this.editing = snippet

                if (this.editing.type === 'js') {
                    Vue.nextTick(() => this.$refs.editor.setValue(this.editing.value))
                }
            },
            add() {
                const newSnippet = {
                    id: _.random(1000000, 9999999),
                    key: '',
                    value: '',
                    regex: false,
                    type: 'plain',
                }

                this.snippets.push(newSnippet)
                this.editing = newSnippet

                Vue.nextTick(() => this.$refs.list.scrollTop = this.$refs.list.scrollHeight)
            },
            append(emoji) {
                this.editing.value += emoji
            },
            remove(snippet) {
                this.snippets = this.snippets.filter(s => s.id !== snippet.id)
                this.editing = null
            },
            save() {
                this.statusVisible = true
                this.status = 'Saving...'

                this.saved()
            },
            saved: _.debounce(function () {
                this.status = 'All changes saved!'

                this.hideStatus()
            }, 1000),
            hideStatus: _.debounce(function () {
                this.statusVisible = false
            }, 3000),
            changedType() {
                if (this.editing.type === 'js' && !this.editing.value) {
                    this.editing.value = '/**\n * @param {string} trigger A string that was matched\n * @return {string} Replacement\n */\nfunction qw(trigger) {\n  return trigger.toUpperCase()\n}\n'
                }
                Vue.nextTick(() => this.$refs.editor.setValue(this.editing.value))
            },
        },
        directives: {
            focus: {
                inserted(el) {
                    el.focus()
                },
            },
        },
        created() {
            this.snippets = _.cloneDeep(this.$store.getters.snippets)
        },
    }
</script>

