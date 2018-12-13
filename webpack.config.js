const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const NEW_TAB = 'newTab';
const POPUP = 'popup';

module.exports = {
    entry: {
        [NEW_TAB]: ['@babel/polyfill', `./src/${NEW_TAB}/index.js`],
        [POPUP]: ['@babel/polyfill', `./src/${POPUP}/index.js`]
    },
    output: {
        filename: '[name]/index.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
                include: path.join(__dirname, 'src')
            },

            {
                test: /\.(s?css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', 'sass-loader']
                })
            },

            {
                test: /\.(jpg|png|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            publicPath: 'img/',
                            outputPath: 'img/'
                        }
                    }
                ]
            },

            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            publicPath: 'css/fonts/',
                            outputPath: 'css/fonts/'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], { root: path.resolve(__dirname, ''), verbose: true }),
        new CopyWebpackPlugin([
            // {
            //     from: 'src/img/',
            //     to: 'img/'
            // }
            {
                from: 'src/manifest.json',
                to: ''
            }
        ]),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({
            filename: '[name]/styles.min.css'
        }),
        new HtmlWebPackPlugin({
            chunks: [NEW_TAB],
            template: `./src/${NEW_TAB}/index.html`,
            filename: `./${NEW_TAB}.html`
        }),
        new HtmlWebPackPlugin({
            chunks: [POPUP],
            template: `./src/${POPUP}/index.html`,
            filename: `./${POPUP}.html`
        })
    ],
    optimization: {
        minimizer: [new TerserPlugin()]
    }
};
