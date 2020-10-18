"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const vite_plugin_react_1 = __importDefault(require("vite-plugin-react"));
const config = {
    jsx: 'react',
    base: './',
    outDir: './dist/front',
    assetsInlineLimit: 0,
    plugins: [vite_plugin_react_1.default],
    optimizeDeps: {
        auto: false,
    },
};
module.exports = config;
