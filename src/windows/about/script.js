const { shell } = require('electron')

document.querySelector('#dc').addEventListener('click', () => shell.openExternal('https://dczajkowski.com'))
document.querySelector('#gt').addEventListener('click', () => shell.openExternal('https://github.com/gtluszcz'))

document.querySelectorAll('a').forEach(el => el.addEventListener('click', e => {
    e.preventDefault()

    shell.openExternal(el.getAttribute('href'))
}))
