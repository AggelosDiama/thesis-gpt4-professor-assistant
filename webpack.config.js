const path = require('path')

module.exports = {
    mode: 'development',
    entry: {
        login:'./functions/index.js',
        register:'./functions/register.js',
        main:'./functions/main.js'
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].bundle.js'
    },
    watch: true
}
