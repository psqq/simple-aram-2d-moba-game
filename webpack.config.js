const path = require('path');
const del = require('del');

module.exports = (env, options) => {

    const config = {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist', 'js'),
            filename: 'main.js'
        }
    };

    if (options.mode === 'development') {
        config.devtool = 'source-map';
        config.watchOptions = {
            aggregateTimeout: 300,
            poll: 1000,
            ignored: /node_modules/
        };
    } else if (options.mode === 'production') {
        del.sync(['./dist/*.map']);
    }

    return config;
};
