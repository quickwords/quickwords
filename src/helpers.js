module.exports = {
    tap(object, callback) {
        callback(object)
        return object
    },
    doNotQuitAppOnWindowClosure(windows) {
        Object.keys(windows).forEach(key => windows[key].on('close', e => {
            e.preventDefault()
            windows[key].hide()
        }))
    },
    unregisterWindowListeners(windows) {
        Object.keys(windows).forEach(key => windows[key].removeAllListeners('close'))
    },
}
