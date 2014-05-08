var wobot = require('wobot').Bot;
var EventEmitter = require('events').EventEmitter;
var utils = require('util');
var http = require('http');
var comms = require('./events.js');
var querystring = require('querystring');

var logger;

var name;

var bot = function(config, rooms) {
    EventEmitter.call(this);

    this.bot = new wobot(config);
    this.bot.connect();

    this.bot.onConnect(function(){
        logger.info('Connected to HipChat');

        rooms.forEach((function(room){
            if(!room.enabled) return;
            this.join(room['id']+'@conf.hipchat.com');
            logger.info('Joined '+room['label']);
        }).bind(this));

    });

    this.bot.onMessage('!cash', function(channel, from, message) {
        this.message(channel, name);
    });

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

    this.bot.onMessage('!pugbomb', function(channel, from, message) {

        logger.info('Received pug request');

        var self = this;

        var options = {
            host: 'pugme.herokuapp.com',
            port: 80,
            path: '/random'
        };

        http.get(options, function(res) {
            var data = '';
            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on('end', function(chunk) {
                data = JSON.parse(data);
		/*self.message(channel, 'Mi sorry, no puggy!');*/
                self.message(channel, data.pug);
            });
        });

        return true;
    });

    this.bot.onMessage('!weather', function(channel, from, message) {

        logger.info('Received weather request');

        var self = this;

        var options = {
            host: 'api.openweathermap.org',
            port: 80,
            path: '/data/2.5/weather?'+querystring.stringify({'lat': 51.520625, 'lon': -0.052201, 'units': 'metric'}),
        };

        http.get(options, function(res) {
            var data = '';
            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on('end', function(chunk) {
                data = JSON.parse(data);

                var message = "Temperature: "+data.main.temp+"°C (Min: "+data.main.temp_min+" / Max: "+data.main.temp_max+")\n";
                message += "Humidity: "+data.main.humidity+"%\n";
                var conditions = [];

                data.weather.forEach(function(weather){
                    conditions.push(weather.main+' ('+weather.description+')');
                });

                message += "Conditions: "+conditions.join(' -> ')+"\n";

                self.message(channel, message);

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

module.exports = function(username, password, rooms, passedLogger) {
    name = 'CashPot v1.0 - Moni Hipchat Bot ('+username+'@chat.hipchat.com/bot)';
    logger = passedLogger;
    return new bot({
        jid: username+'@chat.hipchat.com/bot',
        password: password
    }, rooms);
};
