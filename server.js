/*var gh = require('./src/adapters/gh.js');

gh.listen(8080);*/
var monitor = require('./src/monitor.js');

var config = require('./config.json');

var getLogger = require('./src/logger.js').getLogger;

var gh_adapter = require('./src/adapters/gh.js');

var cash = require('./src/cashpot.js');

monitor = new monitor(getLogger('monitor'));

monitor.registerAdapter(gh_adapter(getLogger('github')));

monitor.listen(config.server.port, config.server.timeout);

//starting HC bot

cash(config.cash.username, config.cash.password, config.cash.rooms, getLogger('cashpot'));


