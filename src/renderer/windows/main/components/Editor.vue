<template>
    <div id="editor"></div>
</template>

<script>
    import Vue from 'vue'

    import ace from 'brace'
    import 'brace/ext/statusbar'
    import 'brace/ext/language_tools'
    import 'brace/mode/javascript'
    import 'brace/theme/monokai'
    import 'brace/theme/chrome'

    export default {
        props: ['theme', 'mode'],
        data() {
            return {
                editor: null,
            }
        },
        mounted() {
            this.editor = ace.edit('editor')
            this.editor.setTheme(`ace/theme/${this.theme}`)
            this.editor.getSession().setMode(`ace/mode/${this.mode}`)
            this.editor.setHighlightActiveLine(false)
            this.editor.getSession().setTabSize(2)
            this.editor.setShowPrintMargin(false)

            this.editor.session.$worker.send('setOptions', [
                {
                    esversion: 6,
                    globals: { exec: true, fetch: true },
                    strict: 'implied',
                    undef: true,
                    asi: true,
                },
            ])

            this.editor.getSession().on('change', () => {
                this.$emit('edit', this.editor.getSession().getValue())
            })
        },
        methods: {
            setValue(value) {
                Vue.nextTick(() => this.editor.setValue(value, -1))
            },
        },
        watch: {
            mode() {
                this.editor.getSession().setMode(`ace/mode/${this.mode}`)
            },
            theme() {
                this.editor.setTheme(`ace/theme/${this.theme}`)
            },
        },
    }
</script>
