const filters = require('./routes/pug-filters');
const env = require('./env');
const pug = require('pug');

const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { resolve } = require('path');
const configuration = (options) => ({
    entry: {
        home: ['./views/home/home.ts', './views/footer/footer.ts'],
        about: ['./views/about/about.ts', './views/footer/footer.ts'],
    },
    module: {
        rules: [{
            test: /\.tsx?$/i,
            use: 'ts-loader'
        }, {
            test: /\.js$/i,
            exclude: [/node_modules/i, /\.(min|umd)\.js$/i],
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    cacheDirectory: true
                }
            }
        }, {
            test: /\.(s[ac]ss|css)$/i,
            use: [{
                loader: MiniCssExtractPlugin.loader
            }, {
                loader: 'css-loader'
            }, {
                loader: 'sass-loader'
            }]
        }]
    },
    plugins: [
        new (require('eslint-webpack-plugin'))({
            extensions: ['ts']
        }),
        new HTMLWebpackPlugin({
            templateContent: pug.renderFile('./views/home/home.pug', {
                ...env.default, filters, PAGE: 'home', TITLE: 'XPower'
            }),
            filename: '../views/home/home.pug',
            minify: false, inject: 'body',
            chunks: ['home']
        }),
        new HTMLWebpackPlugin({
            templateContent: pug.renderFile('./views/about/about.pug', {
                ...env.default, filters, PAGE: 'about', TITLE: 'XPower: About'
            }),
            filename: '../views/about/about.pug',
            minify: false, inject: 'body',
            chunks: ['about']
        }),
        new MiniCssExtractPlugin({
            filename: '../styles/[name].[chunkhash:8].css'
        })
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    output: {
        path: resolve(__dirname, 'public', 'scripts'),
        filename: '[name].[chunkhash:8].js',
        clean: true
    },
    mode: 'none', ...options
});
module.exports = (env, args) => {
    switch (args.mode) {
        case 'none':
        case 'production':
        case 'development':
            return configuration({ mode: args.mode });
        default:
            throw new Error('no matching configuration');
    }
};
