<template>
    <div class="bg flex h-screen font-sans" :class="['bg-black text-grey-light', 'bg-image text-grey-darkest'][theme]" id="app">
        <div class="flex flex-col flex-2 p-8">
            <h1 class="flex items-center h-12">
                <span class="flex-1">
                    <span class="text-3xl">Snippets</span>
                    <router-link :to="{ name: 'Preferences' }" class="text-2xl text-grey-dark cursor-pointer no-underline ml-4">Preferences</router-link>
                </span>
            </h1>
            <div class="mt-4 flex">
                <input
                    type="text"
                    placeholder="Search..."
                    v-model="searchSnippets"
                    class="rounded flex-1 py-2 px-4"
                    :class="['bg-grey-light text-grey-darkest', 'border text-grey-darkest'][theme]"
                >
                <!-- <span class="ml-4 font-bold w-6 flex items-center justify-center cursor-pointer">A</span> -->
                <!-- <span class="ml-4 font-bold w-6 flex items-center justify-center cursor-pointer">↓</span> -->
            </div>
            <div class="mb-8 mt-8 overflow-y-scroll flex-1 padding-for-scrollbar">
                <div
                    class="items-center h-12 flex py-4 px-6 mb-4 rounded cursor-pointer clickable"
                    :class="['bg-grey-darkest', 'bg-grey-light'][theme]"
                    v-for="snippet in filteredSnippets"
                    :key="snippet.id"
                    @click="edit(snippet)"
                >
                    <span class="flex-1">{{ snippet.key }}</span>
                    <span class="px-3 ml-2 text-grey-darkest py-1 bg-grey rounded-full" v-if="snippet.regex">regex</span>
                    <span class="px-3 ml-2 text-grey-darkest py-1 bg-grey rounded-full" v-if="snippet.type === 'js'">js</span>
                    <span class="flex items-center ml-2" :class="['', 'text-grey-darkest'][theme]" @click.stop="remove(snippet)">
                        <icon-remove class="h-6 w-6 fill-current"></icon-remove>
                    </span>
                </div>
            </div>
            <div class="flex justify-end">
                <button class="flex items-center justify-center w-8 h-8" :class="['text-grey-light', 'text-grey-darkest'][theme]" @click="add" title="Add snippet">
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
                        >
                        <label for="regex" class="flex justify-center items-center cursor-pointer">
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

                            Use regular expression
                        </label>
                    </div>
                    <div class="relative flex flex-col flex-1 mb-4">
                        <textarea
                            class="rounded flex-1 p-4 text-grey-darkest resize-none"
                            placeholder="Substitute with..."
                            v-model="editing.value"
                            @keydown="save"
                            :class="['bg-grey-darkest text-grey-lightest', 'border'][theme] + ((editing.type === 'js') ? ' font-mono text-sm' : ' font-sans')"
                        ></textarea>
                        <emoji-picker @emoji="append" :search="searchEmojis">
                            <div
                                class="absolute pin-t pin-r p-2 cursor-pointer emoji-invoker"
                                :class="['text-grey', ''][theme]"
                                slot="emoji-invoker"
                                slot-scope="{ events }"
                                v-on="events"
                            >
                                <icon-face class="h-8 w-8 fill-current"></icon-face>
                            </div>
                            <div slot="emoji-picker" slot-scope="{ emojis, insert, display }">
                                <div class="absolute z-10 border w-64 h-96 overflow-scroll p-4 rounded bg-white shadow t-6 r-6">
                                    <div class="flex">
                                        <input class="flex-1 rounded-full border py-2 px-4" type="text" v-model="searchEmojis" v-focus>
                                    </div>
                                    <div>
                                        <div v-for="(emojiGroup, category) in emojis" :key="category">
                                            <h5 class="text-grey-darker uppercase text-sm cursor-default mb-2 mt-4">{{ category }}</h5>
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
                            v-model="editing.type"
                            class="p-4 rounded flex-1"
                            :class="['bg-grey-darkest text-grey-lightest', 'border'][theme]"
                            @change="changedType"
                        >
                            <option value="plain">Plain text</option>
                            <option value="js">JavaScript</option>
                        </select>
                        <icon-arrow-down class="block absolute center-y r-4 w-8 h-8 fill-current text-grey-dark"></icon-arrow-down>
                    </div>
                </div>
                <div v-else class="flex flex-col h-full">
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
    import EmojiPicker from 'vue-emoji-picker'
    import _ from 'lodash'

    import ArrowDown from '../../../icons/ArrowDown'
    import Checkbox from '../../../icons/Checkbox'
    import Face from '../../../icons/Face'
    import Logo from '../../../icons/Logo'
    import LogoMono from '../../../icons/LogoMono'
    import Plus from '../../../icons/Plus'
    import Remove from '../../../icons/Remove'

    export default {
        components: {
            IconArrowDown: ArrowDown,
            IconCheckbox: Checkbox,
            IconFace: Face,
            IconLogo: Logo,
            IconLogoMono: LogoMono,
            IconPlus: Plus,
            IconRemove: Remove,
            EmojiPicker: EmojiPicker,
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

                const regex = new RegExp(`.*${this.searchSnippets}.*`)

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
            },
            add() {
                const newSnippet = {
                    id: Math.floor(Math.random() * (9999999 - 1000000)) + 1000000,
                    key: '',
                    value: '',
                    regex: false,
                    type: 'plain',
                }

                this.snippets.push(newSnippet)
                this.editing = newSnippet
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
                    this.editing.value = '/**\n * @param {string} trigger A string that was matched\n * @return {string} Replacement\n */\nfunction (trigger) {\n  return trigger.toUpperCase()\n}\n'
                }
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
            this.snippets = JSON.parse(JSON.stringify(this.$store.getters.snippets))
        },
    }
</script>

