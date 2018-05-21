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
        'id': 4,
        'key': ';up .* ',
        'value': "// After typing everything after ';up ' becomes uppercase\n// Note that Quickwords matches only last 20\n// characters, so anything above that will not work\nfunction (trigger) {\n    return trigger.substr(4).toUpperCase()\n}\n",
        'regex': true,
        'type': 'js'
    }
]
