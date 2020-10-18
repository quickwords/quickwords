import { Snippet } from '../common/store'

export const defaultSnippets: Snippet[] = [
  {
    id: 1,
    active: true,
    key: ';qw',
    value: 'Quickwords. Write your documents faster. Make everything quicker!',
    regex: false,
    type: 'plain',
  },
  {
    id: 2,
    active: true,
    key: '<3',
    value: '❤️',
    regex: false,
    type: 'plain',
  },
  {
    id: 3,
    active: true,
    key: ';date',
    value: `function qw() {\n  const date = new Date()\n  const month = (n) => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][n]\n  const suffix = (n) => (n < 11 || n > 13) ? ['st', 'nd', 'rd', 'th'][Math.min((n - 1) % 10, 3)] : 'th'\n\n  return \`\${date.getDate()}\${suffix(date.getDate())} of \${month(date.getMonth())} \${date.getFullYear()}\`\n}\n`,
    regex: false,
    type: 'js',
  },
]
