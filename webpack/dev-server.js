const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./serve');
const port = config.devServerPort;
// livereload
for (var prop in config.entry) {
    if (config.entry.hasOwnProperty(prop)) {
        config.entry[prop].unshift(`webpack-dev-server/client?http://localhost:${port}`);
    }
}

const compiler = webpack(config);
const server = new WebpackDevServer(compiler, {
    quiet: false,
    contentBase: 'public',
    publicPath: config.output.publicPath,
    historyApiFallback: true,
    stats: { colors: true }
});
server.listen(port, 'localhost', (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Webpack development server listening on port %s', port);
    }
});
