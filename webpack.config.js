const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin")
const isDev = () => process.env.NODE_ENV === 'development';

module.exports = {
    target: "web",
    mode:'development',
    devtool:'source-map',
    stats: {
        children: true,
    },
    watchOptions: {
        ignored: '**/node_modules',
    },
    entry: {
        index: ['@babel/polyfill', '/src/main.js']
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist/')
    },
    optimization: {
        splitChunks: {
            chunks: "all"
        },
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/views/index.pug'),
            filename: 'index.html',
            minify: false
            // inject: true
      }),

        // new HtmlWebpackPugPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, './src/images'),
                    to: path.resolve(__dirname, 'dist/images'),
                    noErrorOnMissing: true
                },
                {
                    from: path.resolve(__dirname, './src/icons'),
                    to: path.resolve(__dirname, 'dist/icons'),
                    noErrorOnMissing: true
                },
                {
                    from: path.resolve(__dirname, './src/fonts'),
                    to: path.resolve(__dirname, './dist/fonts'),
                    noErrorOnMissing: true
                }
            ],
        }),
    ],
    module:{
        rules: [
            // {
            //     test: /\.twig$/,
            //     use: [
            //         'raw-loader',
            //         {
            //             loader: 'twig-html-loader',
            //             options: {
            //                 data: {
            //                     page: {
            //                         title: 'Sex shop 2211'
            //                     }
            //                 }
            //             }
            //         }
            //     ]
            // },
            {
                test: /\.pug$/,
                include: path.join(__dirname, 'src'),
                use: {loader: 'pug-loader'}
                // rules: ['pug-loader']
            },
            {
                test: /\.s[ac]ss|css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false
                        }
                    },
                    {
                        loader: 'resolve-url-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        }
                    }
                ]
            },
            {
                test: /\.(png|gif|jpg|jpeg|svg)$/,
                use:[{
                    loader: "file-loader?name=images/[name].[ext]",
                    options: {
                        publicPath: path.resolve(__dirname, 'src/images'),
                        outputPath: path.resolve(__dirname, 'dist/images'),
                        name: '[name].[ext]',
                        esModule: false
                    },
                }]
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }]
                        ]
                    }
                }
            },
            {
                test: /\.(woff|woff2|ttf|eot)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: '[path]/[name].[ext]',
                    },
                }]
            }
        ]
    },
    resolve: {
        aliasFields: ['browser'],
        alias: {
            styles: path.resolve(__dirname, 'src/styles'),
            scripts: path.resolve(__dirname, 'src/js'),
        },
    },
    devServer: {
        devMiddleware: {
            writeToDisk: true,
        },
        hot: false,
        // writeToDisk: true,
        port: 3000,
        static: {
            directory: path.join(__dirname, 'src/'),
            watch: true
        },
    },
}
