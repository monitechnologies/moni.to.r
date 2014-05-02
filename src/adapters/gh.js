var express = require('express');
var bodyParser = require('body-parser');

module.exports.listen = function(port) {
    return gh(port);
}

var gh = function(port) {

    var app = express();

    app.use(bodyParser.json());

    app.post('/', function(req, res){
        console.log(req.body);

        res.end();
    });

    this.server = app.listen(port, function() {
        console.log('Listening on port %d', server.address().port);
    });

}