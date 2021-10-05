const path = require('path');

const manager = {
    mode: 'production',
    entry: './src/index.ts',
    resolve: {
        extensions: [".ts", ".js"],
        fallback: {
            "os": false
        }
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader' },
            { test:/resources\/.*\.bin/, type:"asset/inline"},
            { test:/resources\/.*\.json/, type:"asset/source"}            
        ],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        globalObject: 'typeof self !== \'undefined\' ? self : this'
    },
};

module.exports = [
    manager
];

