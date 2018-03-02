module.exports = {
    tap(object, callback) {
        callback(object)
        return object
    },
    doNotCloseAppOnWindowClosure(windows) {
        Object.keys(windows).forEach(key => windows[key].on('close', e => {
            e.preventDefault()
            windows[key].hide()
        }))
    },
}
