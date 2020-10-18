import _ from 'lodash'
import { chars, KEY_BACKSPACE, KEY_ARROWS, KEY_TAB } from '../chars'
import NativeKeymap from 'native-keymap'
import { Notification } from './Notification'
import { Store } from './Store'
import { Analytics } from './Analytics'
import iohook from 'iohook'
import robotjs from 'robotjs'
import { Snippet } from '../../common/store'
import { PlatformAware } from './PlatformAware'
import { ASYNC_SNIPPET_TIMEOUT } from '../constants'
import { clipboard, Clipboard } from 'electron'

type KeyDownEvent = {
  keycode: string
  shiftKey: boolean
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
}

export class SnippetsManager {
  private keyboardSimulator: typeof robotjs

  private keyboardHandler: typeof iohook

  private buffer = ''

  private shouldMatch = true

  private clipboard: Clipboard

  constructor(
    private store: Store,
    private notification: Notification,
    private platformAware: PlatformAware,
    private analytics: Analytics
  ) {
    this.keyboardHandler = iohook
    this.keyboardSimulator = robotjs
    this.clipboard = clipboard

    this.validateAllFieldsArePresent()

    this.keyboardSimulator.setKeyboardDelay(0)
    this.keyboardHandler.on('keydown', this.onKeyDown.bind(this))
    this.keyboardHandler.on('mouseclick', this.onMouseClick.bind(this))

    this.keyboardHandler.start()
  }

  destructor(): void {
    this.keyboardHandler.unload()
    this.keyboardHandler.stop()
  }

  public stopMatching(): void {
    this.shouldMatch = false
  }

  public startMatching(): void {
    this.shouldMatch = true
  }

  private validateAllFieldsArePresent() {
    const snippets = this.store.snippets.map(({ active, regex, type, ...snippet }) => ({
      ...snippet,
      active: active ?? true,
      regex: regex ?? false,
      type: type ?? 'plain',
    }))

    this.store.set('snippets', snippets)
  }

  private onKeyDown(e: KeyDownEvent) {
    if (!this.shouldMatch) {
      return
    }

    if (this.shouldResetBuffer(e)) {
      this.resetBuffer()
      return
    }

    if (this.isBackspace(e.keycode)) {
      this.shortenBufferBy(1)
      return
    }

    const character = this.eventToUnicode(e)

    if (character !== null) {
      this.addCharToBuffer(character)
      this.shortenBufferIfNecessary()
      this.replaceSnippetIfMatchFound()
    }
  }

  private onMouseClick() {
    this.resetBuffer()
  }

  private isBackspace(keycode: string): boolean {
    return this.getCharNameFromKeycode(keycode) === KEY_BACKSPACE
  }

  private getCharNameFromKeycode(keycode: string): string | null {
    return _.get(chars, keycode, null)
  }

  private eventToUnicode({ keycode, shiftKey, altKey, ctrlKey, metaKey }: KeyDownEvent): string | null {
    const name = this.getCharNameFromKeycode(keycode)
    const keymap = NativeKeymap.getKeyMap()

    if (!name || !(name in keymap)) {
      return null
    }

    if (shiftKey && altKey && !ctrlKey && !metaKey) {
      return _.get(keymap, `${name}.withShiftAltGr`, null) as string | null
    }

    if (shiftKey && !ctrlKey && !metaKey) {
      return _.get(keymap, `${name}.withShift`, null) as string | null
    }

    if (altKey && !ctrlKey && !metaKey) {
      return _.get(keymap, `${name}.withAltGr`, null) as string | null
    }

    if (!ctrlKey && !metaKey) {
      return _.get(keymap, `${name}.value`, null) as string | null
    }

    return null
  }

  private resetBuffer() {
    this.buffer = ''
  }

  private shouldResetBuffer({ keycode, altKey }: KeyDownEvent) {
    const pressed = this.getCharNameFromKeycode(keycode)

    return (
      pressed === null ||
      (pressed === KEY_BACKSPACE && altKey === true) ||
      pressed === KEY_TAB ||
      KEY_ARROWS.includes(pressed)
    )
  }

  private reportToAnalytics(snippet: Snippet) {
    this.analytics.report({
      name: 'snippet-replacement',
      user: this.store.user,
      regex: snippet.regex,
      type: snippet.type,
    })
  }

  private async evaluate(matchedString: string, code: string): Promise<string> {
    'use strict'

    const timeout = setTimeout(() => {
      throw new Error('Function timed out after 5 seconds of inactivity')
    }, ASYNC_SNIPPET_TIMEOUT)

    let executable

    try {
      executable = eval(`
        const fetch = require('node-fetch');
        (${code})
      `)
    } catch (err) {
      throw new Error(String(err))
    }

    if (!_.isFunction(executable)) {
      throw new Error('Used snippet code is not a function')
    }

    const e = executable(matchedString)
    const data = await Promise.resolve(e)

    clearTimeout(timeout)

    if (!_.isString(data) && !_.isNumber(data)) {
      throw new Error('User-defined function returned invalid type. Expected a Promise, string or number.')
    }

    return String(data)
  }

  private async replaceSnippetIfMatchFound() {
    for (const snippet of this.store.snippets) {
      if (!snippet.active) {
        continue
      }

      let key = snippet.key

      if (!snippet.regex) {
        key = _.escapeRegExp(key)
      }

      const match = new RegExp(`.*(${key})$`).exec(this.buffer)
      const matchedString = _.get(match, 1, false)

      if (matchedString) {
        for (let i = 0; i < matchedString.length; i++) {
          this.keyboardSimulator.keyTap('backspace')
        }

        if (snippet.type === 'js') {
          this.replace(await this.handleJavascriptSnippet(matchedString, snippet.value))
        } else {
          this.replace(this.handlePlainTextSnippet(snippet.value))
        }

        this.reportToAnalytics(snippet)

        break
      }
    }
  }

  private replace(value: string) {
    const clipboardContent = this.clipboard.readText()

    this.clipboard.writeText(value)

    setTimeout(() => this.paste, 50)
    setTimeout(() => this.clipboard.writeText(clipboardContent), 500)
  }

  private async handleJavascriptSnippet(matchedString: string, code: string) {
    try {
      return await this.evaluate(matchedString, code)
    } catch (error) {
      if (!this.notification.isSupported) {
        return `QWError ${_.get('error', 'message', String(error))}`
      }

      this.notification.show('QWError', _.get('error', 'message', String(error)))

      return ''
    }
  }

  private handlePlainTextSnippet(value: string) {
    return value
  }

  private paste() {
    this.keyboardSimulator.keyTap('v', this.platformAware.get('pasteModifier'))
  }

  private addCharToBuffer(character: string) {
    this.buffer += character
  }

  private shortenBufferBy(amount: number) {
    this.buffer = this.buffer.substring(0, this.buffer.length - amount)
  }

  private shortenBufferIfNecessary() {
    if (this.buffer.length > this.store.bufferLength) {
      this.buffer = this.buffer.substring(1)
    }
  }
}
