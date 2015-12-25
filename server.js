const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config.server');
const port = config.devServerPort;
// hot reload
config.entry.unshift(`webpack-dev-server/client?http://localhost:${port}`);
const compiler = webpack(config);

new WebpackDevServer(compiler, {
    // hot: true,
    // serve directory
    contentBase: 'public',
    // public path
    publicPath: config.output.publicPath,
    historyApiFallback: true,
    stats: {
        colors: true
    }
}).listen(port, 'localhost', (err) => {
    if (err) console.error(err);
    console.log(`Listenging at http://localhost:${port}`);
});
