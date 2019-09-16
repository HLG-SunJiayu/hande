// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
    "plugins": {
        "postcss-import": {},
        "postcss-url": {},
        "postcss-aspect-ratio-mini": {},
        "postcss-cssnext": {},
        "postcss-px-to-viewport": {
            "viewportWidth": 375,
            "viewportHeight": 667,
            "unitPrecision": 3,
            "viewportUnit": "vw",
            "selectorBlackList": [
                ".ignore",
                ".hairlines"
            ],
            "minPixelValue": 3,
            "mediaQuery": false
        },
        "cssnano": {
            "autoprefixer": false,
            "postcss-zindex": false
        }
    }
}
