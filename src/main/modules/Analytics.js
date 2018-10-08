const fetch = require('node-fetch')

class Analytics {
    static report(event, { user, regex, type }) {
        fetch(process.env.ANALYTICS_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event, user, regex, type, version: process.env.VERSION,
            }),
        }).then(() => {}).catch(() => {})
    }
}

module.exports = Analytics
