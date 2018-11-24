const path = require('path');
const del = require('del');
const webpack = require('webpack');

module.exports = (env, options) => {

    const config = {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist', 'js'),
            filename: 'main.js'
        },
        // module: {
        //     noParse: /jquery/,
        // },
        plugins: [
            new webpack.ProvidePlugin({
                '$': 'jquery',
            })
        ],
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
