module.exports = [
    {
        'id': 1,
        'key': ';qw',
        'value': 'Quickwords. Write your documents faster. Make everything quicker!',
        'regex': false,
        'type': 'plain'
    },
    {
        'id': 2,
        'key': '<3',
        'value': '❤️',
        'regex': false,
        'type': 'plain'
    },
    {
        'id': 3,
        'key': ';edit .* ',
        'value': "// It opens a file you provide it in your default editor\n// Just try typing ';edit ~/hello.txt ' (note the trailing space)\nfunction (trigger) {\n    return new Promise((resolve) => {\n        const filename = trigger.split(' ')[1]\n\n        const exec = require('child_process').exec\n        exec(`\\`$EDITOR ${filename}\\``)\n        \n        setTimeout(() => resolve(''), 100)\n    })\n}\n",
        'regex': true,
        'type': 'js'
    },
    {
        'id': 4,
        'key': ';up .* ',
        'value': "// After typing everything after ';up ' becomes uppercase (note the trailing space)\nfunction (trigger) {\n    return trigger.substr(4).toUpperCase()\n}\n",
        'regex': true,
        'type': 'js'
    }
]
