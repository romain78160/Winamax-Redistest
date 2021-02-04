

var log = function(opts, level){
    var logger = require('simple-node-logger').createRollingFileLogger(opts);
    logger.setLevel(level);
    return logger;
}

module.exports = log;