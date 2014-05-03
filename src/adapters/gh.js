var express = require('express');
var crypto = require('crypto');
var EventEmitter = require('events').EventEmitter
var comms = require('./../events.js');
var util = require('util');
var http = require('http');
var https = require('https');
var querystring = require('querystring');

var router = new express.Router();

var logger;
var tokens;

function gh() {

    EventEmitter.call(this);

    this.subscribe = function(emitter) {
        var self = this;

        var descriptions = {
            'pending': 'Build in progress',
            'success': 'Build successful',
            'error': 'Build did not complete',
            'failure': 'Build failed'
        }

        var notifyGH = function(buildEvent){

            logger.debug('Notifying github, status: %s', buildEvent.status);

            var postData = JSON.stringify({
                'state': buildEvent.status,
                'description': descriptions[buildEvent.status],
                'target_url': 'http://detail.com',
                'context': 'moni.to.r'
            })

            var options = {
                host: 'api.github.com',
                port: 443,
                path: '/repos/'+buildEvent.repository.name+'/statuses/'+buildEvent.commit.id,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': postData.length,
                    'User-Agent': 'moni.to.r',
                    'Accept': 'application/vnd.github.she-hulk-preview+json'
                },
                auth: tokens.status+':x-oauth-basic',
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

        };

        emitter.on(comms.events.BUILD_STARTED, notifyGH);

        emitter.on(comms.events.BUILD_FINISHED, notifyGH);
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
                new comms.model.repository(
                    body.repository.owner.name+'/'+body.repository.name,
                    body.repository.url,
                    body.repository.master_branch,
                    body.repository.description
                ),
                {view: body.head_commit.url}
            )];
            logger.debug('Processing PUSH')
            break;
        case 'pull_request':
            event = [comms.events.PULL_REQUEST, new comms.model.prEvent(
                new comms.model.commit(
                    body.pull_request.base.sha,
                    null,
                    null
                ),
                new comms.model.commit(
                    body.pull_request.head.sha,
                    null,
                    null
                ),
                new comms.model.repository(body.repository.full_name, body.repository.url, body.repository.default_branch, body.repository.description),
                {view: body.pull_request.url}
            )];
            logger.debug('Processing PR');
            break;
        default:
            logger.debug('Unknown command %s', command);
            return;
    }

    logger.silly('Emitting %s with:', comms.labels[event[0]], event[1]);

    this.emit.apply(this, event);

});

module.exports = function(passedTokens, passedLogger) {
    tokens = passedTokens;
    logger = passedLogger;
    return new gh();
};