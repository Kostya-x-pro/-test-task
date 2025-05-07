const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/scripts/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true,
        publicPath: '/-test-task/'
        // publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[name][ext]'
                }
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                useShortDoctype: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'css/styles.[contenthash].css'
        }),
        new CopyPlugin({
            patterns: [
                { 
                    from: 'src/assets/images',
                    to: 'assets/images',
                    globOptions: {
                        ignore: ['**/*.svg']
                    }
                },
                { 
                    from: 'src/assets/locales', 
                    to: 'assets/locales' 
                }
            ]
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
        open: true,
        hot: true,
        historyApiFallback: true
    },
    optimization: {
        minimize: true,
        splitChunks: {
            chunks: 'all'
        }
    }
};