var EventEmitter = require('events').EventEmitter;
var utils = require('util');
var comms = require('./../events.js');

var logger;

var ci = function() {

    EventEmitter.call(this);

    this.attach = function() {};

    this.build = function(commit, repository) {

        var self = this;

        self.emit(comms.events.BUILD_STARTED, new comms.model.buildEvent(
            'pending', commit, repository
        ));

        setTimeout(function() {
            self.emit(comms.events.BUILD_FINISHED, new comms.model.buildEvent(
                'success', commit, repository
            ));
        }, 3000);
    }

    this.subscribe = function(emitter) {

        var self = this;

        emitter.on(comms.events.COMMIT, function(commitEvent){
            logger.debug('Received build request via COMMIT event');
            self.build(commitEvent.commit, commitEvent.repository);
        })

        emitter.on(comms.events.PULL_REQUEST, function(commitEvent){
            logger.debug('Received build request via PULL_REQUEST event');
            self.build(commitEvent.headCommit, commitEvent.repository);
        })
    };
}

utils.inherits(ci, EventEmitter);

module.exports = function(passedLogger) {
    logger = passedLogger;

    return new ci();
}