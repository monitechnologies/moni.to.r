var winston = require('winston');
var config = require('./../config.json');
var merge = require('merge-descriptors');

winston.addColors(config.logger.colors);
loggerConfig = config.logger.transports;

exports.getLogger = function(prefix) {
    var returnConfig = merge({}, loggerConfig);
    for(var prop in returnConfig) {
        returnConfig[prop]['label'] = prefix;
    }
    winston.loggers.add(prefix, returnConfig);

    return winston.loggers.get(prefix);
}