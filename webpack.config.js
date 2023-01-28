const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const mainConfig = {
    entry: {
        'demo-page': './src/art/demo-page.js',
        'browse-1': './src/art/browse-1.js',
        'browse-2': './src/art/browse-2.js',
        'browse-3': './src/art/browse-3.js',
        'browse-4': './src/art/browse-4.js',
        'browse-5': './src/art/browse-5.js',
        'browse-6': './src/art/browse-6.js',
        'browse-7': './src/art/browse-7.js',
        'browse-8': './src/art/browse-8.js',
        'browse-9': './src/art/browse-9.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    watchOptions: {
        ignored: ['**/output', '**/node_modules'],
    },
    optimization: {
        minimizer: [new TerserPlugin({
            extractComments: false,
        })],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(s[ac]ss|less)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                    'sass-loader'
                ]
            }
        ],
    }
};

const styleConfig = Object.assign({}, mainConfig, {
    name: "style-import",
    entry: './styles/style-import.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "style-import.js"
    },
});


module.exports = [
    mainConfig,
    styleConfig
]