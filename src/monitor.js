var http = require('http');
var events = require('./events.js').events;
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function monitor(logger) {

    EventEmitter.call(this);

    this.logger = logger;
    var monitor = this;
    var server = http.createServer();
    var config = {};
    var timeout = this.timeout = 5000;

    server.on('request', function(req, res) {
        monitor.logger.debug('Request received %s %s', req.method, req.url);

        var to = setTimeout(function() {
            monitor.logger.warn('Timing out after %s miliseconds', timeout)
            res.end();
        }, timeout)

        res.on('finish', function() {
            monitor.logger.debug('Response sent');
            clearTimeout(to);
        })

    });

    this.subscribe = function(emitter) {

        emitter.on(events.COMMIT, (function(payload) {
            logger.debug('Received COMMIT, forwarding.');
            this.emit(events.COMMIT, payload);
        }).bind(this)); //simply re-emitting commit event

    }

    this.registerAdapter = function(adapter) {
        adapter.subscribe(monitor);
        monitor.subscribe(adapter);
        adapter.attach(server);
    }

    this.listen = function(port, timeout) {

        server.listen(port);

        this.timeout = timeout || this.timeout;

        monitor.logger.info('Started on %s', port);
    }

    return this;

}

util.inherits(monitor, EventEmitter);

module.exports = monitor;