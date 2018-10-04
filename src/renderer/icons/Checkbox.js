export default {
    props: {
        checked: {
            type: Boolean,
            default: false,
        },
    },
    template: `
        <svg v-if="checked" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3h14c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zm0 2v14h14V5H5zm11.2 4c-.4-.4-1-.4-1.4 0l-3.9 3.9-1.6-1.6c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l2.3 2.3c.4.4 1 .4 1.4 0l4.6-4.6c.4-.4.4-1 0-1.4z"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2zm0 2v14h14V5H5z"/></svg>
    `,
}
