const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const { Years } = require('./source/years');
const { mkdir } = require('fs/promises');
const { resolve } = require('path');
const pug = require('pug');

const filters = require('./filters');
const env = require('./env');

const configuration = ({
    mode, ...options
}) => ({
    externals: {
        ethers: 'ethers',
        jquery: 'jQuery',
        react: 'React',
    },
    entry: {
        app: {
            import: [
                './library/index.ts',
                './views/header/header.tsx',
                './views/app.tsx',
                './views/footer/footer.tsx',
            ],
        },
        error: {
            import: [
                './library/index.ts',
                './views/header/header.tsx',
                './views/error/error.ts',
                './views/footer/footer.tsx',
            ],
        },
        migrate: {
            import: [
                './library/index.ts',
                './views/header/header.tsx',
                './views/connector/connector.tsx',
                './views/migrate/index.ts',
                './views/footer/footer.tsx',
            ],
        },
        worker_dev: {
            import: './source/miner/scripts/worker.ts',
            filename: 'worker.js',
        },
        worker_pro: {
            import: './source/miner/scripts/worker.ts',
            filename: 'worker.[contenthash:8].js',
        },
    },
    module: {
        rules: [{
            test: /\.tsx?$/i,
            use: 'ts-loader'
        }, {
            test: /\.html$/,
            loader: 'html-loader',
            options: { sources: false }
        }, {
            test: /\.(s[ac]ss|css)$/i,
            use: [{
                loader: MiniCssExtractPlugin.loader
            }, {
                loader: 'css-loader'
            }, {
                loader: 'sass-loader',
                options: {
                    sassOptions: {
                        silenceDeprecations: ['mixed-decls'],
                    }
                }
            }]
        }, {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[contenthash:8].[ext]',
                    outputPath: '../images/all/',
                },
            }],
        }]
    },
    performance: {
        maxAssetSize: 4194304, // 4 MiB
        maxEntrypointSize: 4194304, // 4 MiB
    },
    plugins: [
        new HTMLWebpackPlugin({
            templateContent: pug.renderFile('./views/error/error.pug', {
                ...env.default, filters, mode
            }),
            filename: '../views/error/error.pig',
            minify: false, inject: 'body',
            chunks: ['error']
        }),
        new HTMLWebpackPlugin({
            templateContent: pug.renderFile('./views/migrate/index.pug', {
                ...env.default, filters, mode
            }),
            filename: '../views/migrate/index.pig',
            minify: false, inject: 'body',
            chunks: ['migrate']
        }),
        new HTMLWebpackPlugin({
            templateContent: pug.renderFile('./views/home/home.pug', {
                ...env.default, filters, mode
            }),
            filename: '../views/home/home.pig',
            minify: false, inject: 'body',
            chunks: ['app']
        }),
        new HTMLWebpackPlugin({
            templateContent: pug.renderFile('./views/mine/mine.pug', {
                ...env.default, filters, mode
            }),
            filename: '../views/mine/mine.pig',
            minify: false, inject: 'body',
            chunks: ['app']
        }),
        new HTMLWebpackPlugin({
            templateContent: pug.renderFile('./views/nfts/nfts.pug', {
                ...env.default, filters, mode, ...{ YEARS: Array.from(Years()) }
            }),
            filename: '../views/nfts/nfts.pig',
            minify: false, inject: 'body',
            chunks: ['app']
        }),
        new HTMLWebpackPlugin({
            templateContent: pug.renderFile('./views/ppts/ppts.pug', {
                ...env.default, filters, mode, ...{ YEARS: Array.from(Years()) }
            }),
            filename: '../views/ppts/ppts.pig',
            minify: false, inject: 'body',
            chunks: ['app']
        }),
        new HTMLWebpackPlugin({
            templateContent: pug.renderFile('./views/swap/swap.pug', {
                ...env.default, filters, mode
            }),
            filename: '../views/swap/swap.pig',
            minify: false, inject: 'body',
            chunks: ['app']
        }),
        new HTMLWebpackPlugin({
            templateContent: pug.renderFile('./views/about/about.pug', {
                ...env.default, filters, mode
            }),
            filename: '../views/about/about.pig',
            minify: false, inject: 'body',
            chunks: ['app']
        }),
        new MiniCssExtractPlugin({
            filename: '../styles/[name].[contenthash:8].css'
        })
    ],
    resolve: {
        extensions: [
            '.tsx', '.ts', '.js'
        ],
        fallback: {
            buffer: false, fs: false, path: false
        }
    },
    output: {
        path: resolve(__dirname, 'public', 'scripts'),
        filename: '[name].[contenthash:8].js',
        clean: true
    },
    mode, ...options
});
module.exports = async (env, args) => {
    await mkdir(resolve(__dirname, 'public', 'scripts'), {
        recursive: true
    });
    switch (args.mode) {
        case 'none':
        case 'production':
        case 'development':
            return configuration({ mode: args.mode });
        default:
            throw new Error('no matching configuration');
    }
};
