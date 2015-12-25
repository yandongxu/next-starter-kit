const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(options) {
    const alias = {};
    const aliasLoader = {};
    const root = path.join(__dirname, 'src');
    const extensions = ['', '.vue', '.js', '.jsx'];
    const modulesDirectories = ['node_modules'];
    const entry = [
        './src/main'
    ];
    const output = {
        // TODO https://github.com/petehunt/webpack-howto#5-stylesheets-and-images
        publicPath: options.devServer ?
            `http://localhost:${options.port}/assets/scripts` :
            'assets/scripts',
        path: path.join(__dirname, (options.longTermCaching ? 'dist' : 'public'), 'assets/scripts'),
        filename: options.longTermCaching ? 'bundle.[hash].js' : 'bundle.js',
        sourceMapFilename: options.longTermCaching ? 'debug/bundle.[hash].js.map' : 'bundle.js.map',
        // chunkFilename: options.longTermCaching ? '[id].[hash].chunk.js' : 'bundle.chunk.js',
        pathinfo: options.debug
    };
    const loaders = [{
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
    }];
    const plugins = [];
    if (options.minimiz) {
        plugins.push(
            // definePlugin
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
        // plugins.push(new StatsPlugin(path.join(__dirname, "build", "stats.prerender.json"), {
        // 	chunkModules: true,
        // 	exclude: excludeFromStats
        // }));
    }

    if (options.longTermCaching) {
        plugins.push(new HtmlWebpackPlugin({
            // query hash
            // hash: true,
            filename: '../../index.html',
            title: options.title || 'Next Starter Kit',
            lang: options.lang || 'en',
            inject: true,
            template: 'webpack.tpl.html'
        }));
    }

    // if(options.commonsChunk) {
    //     plugins.push(new webpack.optimize.CommonsChunkPlugin("commons", "commons.js" + (options.longTermCaching && !options.prerender ? "?[chunkhash]" : "")));
    // }

    // if(options.separateStylesheet && !options.prerender) {
    //     plugins.push(new ExtractTextPlugin("[name].css" + (options.longTermCaching ? "?[contenthash]" : "")));
    // }

    return {
        entry,
        output,
        plugins,
        resolveLoader: {
            root: path.join(__dirname, 'node_modules'),
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
            loaders
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
