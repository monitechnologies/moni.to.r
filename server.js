/*var gh = require('./src/adapters/gh.js');

gh.listen(8080);*/
var monitor = require('./src/monitor.js');

var config = require('./config.json');

var getLogger = require('./src/logger.js').getLogger;

var gh_adapter = require('./src/adapters/gh.js');
var ci_adapter = require('./src/adapters/ci.js');
var hc_adapter = require('./src/adapters/hipchat.js');

var cash = require('./src/cashpot.js');

monitor = new monitor(getLogger('monitor'));

monitor.registerAdapter(gh_adapter(config.github.tokens, getLogger('github')));
monitor.registerAdapter(ci_adapter(getLogger('ci')));
monitor.registerAdapter(hc_adapter(config.hipchat.token, config.hipchat.rooms, getLogger('hipchat')));

monitor.listen(config.server.port, config.server.timeout);

//starting HC bot

cash(config.cash.username, config.cash.password, config.cash.rooms, getLogger('cashpot'));


