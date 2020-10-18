import fetch from 'node-fetch'
import { PlatformAware } from './PlatformAware'
import { ANALYTICS_URL } from '../constants'

type Event = {
  name: 'snippet-replacement'
  user: string
  regex: boolean
  type: 'plain' | 'js'
}

export class Analytics {
  constructor(private platformAware: PlatformAware) {
    //
  }

  public async report({ name, user, regex, type }: Event): Promise<void> {
    try {
      await fetch(ANALYTICS_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: name,
          user,
          regex,
          type,
          platform: this.platformAware.platform,
          version: process.env.VERSION,
        }),
      })
    } catch {
      //
    }
  }
}
