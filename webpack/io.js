const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const precss = require('precss');

module.exports = function(options) {
    const alias = {};
    const aliasLoader = {};
    const externals = [];
    const extensions = ['', '.js', '.jsx', '.vue', '.css'];
    const modulesDirectories = ['node_modules'];
    const root = path.resolve(__dirname, '../src');
    const entry = Object.assign({ main: ['./src/scripts/main'] }, options.entry);
    const output = {
        publicPath: options.devServer ? '/' : 'assets/',
        path: path.resolve(__dirname, (options.longTermCaching ? '../dist' : 'public'), 'assets'),
        // works: bundle all files
        // filename: options.longTermCaching ? 'scripts/bundle.[hash].js' : 'scripts/bundle.js',
        // chunks
        filename: options.longTermCaching ? 'scripts/[name].[hash].js' : 'scripts/[name].js',
        // chunkFilename: (options.devServer ? '[id]' : '[name]') + (options.longTermCaching ? '.[chunkhash]' : '') + '.js',
        sourceMapFilename: 'debug/[file].map',
        pathinfo: options.debug
    };
    const loaders = [
        {
            test: /\.jsx?$/,
            loaders: ['babel'],
            include: path.resolve(__dirname, '../src')
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!postcss-loader', {
                publicPath: '../'
            })
        }, {
            test: /\.(png|jpe?g|gif|svg)$/,
            loaders: [
                'url-loader?limit=8192&name=images/[name].[ext]',
                'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false',
                'file-loader?name=images/[name].[ext]'
            ]
        }, {
            test: /\.(woff|woff2)$/,
            loader: 'url-loader?limit=100000&name=fonts/[name].[ext]'
        }, {
            test: /\.(ttf|eot)$/,
            loader: 'file-loader?name=fonts/[name].[ext]'
        }
    ];
    const htmlWebpackConfig = {
        devServer: options.devServer,
        hash: false,
        title: options.title || 'Next Starter Kit',
        lang: options.lang || 'en',
        inject: false,
        template: './webpack/default.tpl.html'
    };
    const plugins = [];
    const pages = [{ filename: 'index.html' }].concat(options.pages || []);

    pages.forEach((page) => {
        plugins.push(
            new HtmlWebpackPlugin(Object.assign({}, htmlWebpackConfig, {
                hash: false,
                title: page.title || htmlWebpackConfig.title,
                filename: (options.longTermCaching ? '../' : '') + page.filename
            }))
        );
    });

    if (options.minimiz) {
        plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            }),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compressor: { warnings: false }
            }),
            new webpack.NoErrorsPlugin()
        );
    }

    if (options.longTermCaching) {
        plugins.push(
            new ExtractTextPlugin('styles/[name].[hash].css', {
                allChunks: true
            })
        );
    } else {
        plugins.push(
            new ExtractTextPlugin('styles/[name].css')
        );
    }

    return {
        entry,
        output,
        plugins,
        externals,
        resolveLoader: {
            root: path.resolve(__dirname, '../node_modules'),
            alias: aliasLoader
        },
        resolve: {
            root,
            modulesDirectories,
            extensions,
            alias
        },
        watch: options.watch,
        devtool: options.devtool,
        debug: options.debug,
        module: {
            noParse: [],
            loaders
        },
        postcss: () => {
            return [autoprefixer({ browsers: ['last 2 versions'] }), precss];
        },
        devServer: {
            stats: {
                cached: false,
                exclude: []
            }
        },
        devServerPort: options.port || 9000
    };
};
