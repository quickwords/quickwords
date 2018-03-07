const electron = require('electron')
const currentWindow = electron.remote.getCurrentWindow()
const shell = electron['shell']

document.querySelector('#dc').addEventListener('click', e => shell.openExternal('https://dczajkowski.com'))
document.querySelector('#gt').addEventListener('click', e => shell.openExternal('https://github.com/gtluszcz'))

document.querySelectorAll('a').forEach(el => el.addEventListener('click', e => {
    e.preventDefault()

    shell.openExternal(el.getAttribute('href'))
}))
