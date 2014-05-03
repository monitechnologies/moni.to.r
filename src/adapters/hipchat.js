var EventEmitter = require('events').EventEmitter;
var utils = require('util');
var comms = require('./../events.js');
var querystring = require('querystring');
var https = require('https');

var logger;
var token;
var rooms;

var hipchat = function() {

    EventEmitter.call(this);

    this.attach = function() {};

    this.subscribe = function(emitter) {

        var self = this;

        function sendMessage(message, bgColor) {
            var postData = querystring.stringify({
                'room_id': rooms[0],
                'from': 'moni.to.r',
                'message': message,
                'message_format': 'html',
                'notify': true,
                'color': bgColor
            });

            var options = {
                host: 'api.hipchat.com',
                port: 443,
                path: '/v1/rooms/message?auth_token='+token,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': postData.length,
                    'User-Agent': 'moni.to.r'
                },
                strictSSL: false
            };

            var post = https.request(options, function(res){
                var responseData = '';
                res.on('data', function(data) {
                    responseData += data;
                });

                res.on('end', function(){
                    logger.silly(JSON.parse(responseData));
                })
            });

            post.on('error', function(e) {
                logger.error(e);
            });

            post.write(postData);
            post.end();
        }

        emitter.on(comms.events.BUILD_STARTED, function(buildEvent){
            logger.debug('Notifying hipchat, status: %s', buildEvent.status);

            sendMessage(
                '<b>Build started</b> #'+buildEvent.commit.id
                ,'yellow'
            )

        })

        emitter.on(comms.events.BUILD_FINISHED, function(buildEvent){
            logger.debug('Notifying hipchat, status: %s', buildEvent.status);

            sendMessage(
                '<b>Build finished:</b> '+buildEvent.status+' #'+buildEvent.commit.id
                ,'green'
            )

        })

    };
}

utils.inherits(hipchat, EventEmitter);

module.exports = function(inToken, inRooms, passedLogger) {
    logger = passedLogger;
    token = inToken;
    rooms = inRooms;
    return new hipchat();
}