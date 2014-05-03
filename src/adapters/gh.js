var express = require('express');
var crypto = require('crypto');
var EventEmitter = require('events').EventEmitter
var comms = require('./../events.js');
var util = require('util');

var router = new express.Router();

var logger;

function gh() {

    EventEmitter.call(this);

    this.subscribe = function(emitter) {

    }

    this.attach = function(server) {

        var ghInstance = this;

        logger.info('Attaching github adapter');
        server.on('request', function(req, res) {

            logger.debug('Responding');
            route = router.match(req.method, req.url);
            if(!route) return;

            var requestData = '';

            req.on('data', function(data) {

                requestData += data;

                if(requestData.length > 1e6) {
                    logger.warn('Possible overflow attack - nuking!');
                    return kill(req, res);
                }

            });

            req.on('end', function() {

                if(!validateRequest(requestData, req.headers['x-hub-signature'])) {
                    logger.error('Invalid signature, aborting');
                    return kill(req, res);
                }

                try {
                    input = JSON.parse(requestData);
                } catch(e) {
                    logger.error('Could not parse input');
                    return kill(req, res);
                }

                route.callbacks.forEach(function(callback) {
                    callback.apply(ghInstance, [req.headers['x-github-event'], input])
                });

                res.end()

            })
        })
    }

    return this;
}

util.inherits(gh, EventEmitter);

function kill(req, res) {
    req.connection.destroy();
    res.end()
}

function validateRequest(body, signature) {
    try {
        signature = signature.split('=');
    } catch(e) {
        return false;
    }

    hash = crypto.createHmac(signature[0], 'secret').update(body).digest('hex')

    return signature[1] == hash;
}

router.post('/api/github/v1', function(command, body) {

    var event;

    switch(command) {
        case 'push':
            event = [comms.events.COMMIT, new comms.model.commitEvent(
                new comms.model.commit(
                    body.head_commit.id,
                    body.head_commit.message,
                    body.head_commit.timestamp
                ),
                new comms.model.author(body.head_commit.author.name, body.head_commit.author.email, body.head_commit.author.username),
                new comms.model.repository(body.repository.name, body.repository.url, body.repository.master_branch, body.repository.description),
                {view: body.head_commit.url}
            )];
            logger.debug('Processing PUSH')
            break;
        default:
            logger.debug('Unknown command %s', command);
            console.log(body);
            return;
    }

    logger.silly('Emitting %s with:', comms.labels[event[0]], event[1]);

    this.emit.apply(this, event);

});

module.exports = function(passedLogger) {
    logger = passedLogger;
    return new gh();
};