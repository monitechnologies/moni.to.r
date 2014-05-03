var wobot = require('wobot').Bot;
var EventEmitter = require('events').EventEmitter;
var utils = require('util');
var http = require('http');
var comms = require('./../events.js');

var logger;

var bot = function(config) {
    EventEmitter.call(this);

    var rooms = this.rooms = [];

    this.bot = new wobot(config);
    this.bot.connect();

    this.bot.onConnect(function(){
        logger.info('Connected to HipChat');
        this.join('89450_devops@conf.hipchat.com');
        rooms.push('89450_devops@conf.hipchat.com');
        logger.info('Joined DevOps');
        this.message()

    });

    this.subscribe = function(){};

    this.attach = function(){};

    this.bot.onMessage('!chuck', function(channel, from, message) {

        logger.info('Received chuck request');

        var self = this;

        var options = {
            host: 'api.icndb.com',
            port: 80,
            path: '/jokes/random'
        };

        http.get(options, function(res) {
            var data = '';
            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on('end', function(chunk) {
                data = JSON.parse(data);
                self.message(channel, data.value.joke);
            });
        });

        return true;
    });

    this.bot.onMessage(/\!build [^\s]+\s[^\s]+/, function(channel, from, message) {

        var matches = message.match(/\!build ([^\s]+)\s([^\s]+)/);

        logger.info('Received build request');

        this.message(channel, 'Requesting build for '+matches[1]+'/'+matches[2]);

        return true;
    });
}

utils.inherits(bot, EventEmitter);

module.exports = function(username, password, passedLogger) {
    logger = passedLogger;
    return new bot({
        jid: username+'@chat.hipchat.com/bot',
        password: password
    });
};