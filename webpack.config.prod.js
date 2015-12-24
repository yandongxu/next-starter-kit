module.exports = require('./webpack.config.io')({
    devtool: 'source-map',
    longTermCaching: true,
    minimiz: true,
    // commonsChunk: true
});
