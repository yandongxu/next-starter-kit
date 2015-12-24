const path = require('path');
const webpack = require('webpack');

module.exports = function(options) {
    const alias = {};
    const aliasLoader = {};
    const root = path.join(__dirname, 'src');
    const extensions = ['', '.vue.js', '.js', '.jsx'];
    const modulesDirectories = ['node_modules'];
    const entry = [
        './src/main'
    ];
    const publicPath = options.devServer ?
        'http://localhost:9000/assets/scripts' :
        '/assets/scripts';

    const output = {
        publicPath: publicPath,
        path: path.join(__dirname, (options.longTermCaching ? 'dist' : 'public'), 'assets/scripts'),
        filename: options.longTermCaching ? 'bundle.[hash].js' : 'bundle.js',
        // chunkFilename: (options.devServer ? '[id].js' : '[name].js'),
        sourceMapFilename: 'debug/bundle.[hash].js.map',
        pathinfo: options.debug
    };


    const plugins = [];
    if (options.minimiz) {
        plugins.push(
            // uglify
            new webpack.optimize.UglifyJsPlugin({
                compressor: {
                    warnings: false
                }
            }),
            // dedupe
            new webpack.optimize.DedupePlugin(),
            // definePlugin
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            }),
            // no errors
            new webpack.NoErrorsPlugin()
        );
        // plugins.push(new StatsPlugin(path.join(__dirname, "build", "stats.prerender.json"), {
        // 	chunkModules: true,
        // 	exclude: excludeFromStats
        // }));
    }

    // if(options.commonsChunk) {
    //     plugins.push(new webpack.optimize.CommonsChunkPlugin("commons", "commons.js" + (options.longTermCaching && !options.prerender ? "?[chunkhash]" : "")));
    // }

    // if(options.separateStylesheet && !options.prerender) {
    //     plugins.push(new ExtractTextPlugin("[name].css" + (options.longTermCaching ? "?[contenthash]" : "")));
    // }

    const loaders = [{
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
    }];

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
        }
    };
};
