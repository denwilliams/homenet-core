/**
 * 
 * @module commands
 */

var IMPLEMENTS = 'commands';
var INJECT = ['logger', 'eventBus'];
var CommandManager = require('./command-manager');

function factory(services) {
  var logger = services.logger.getLogger('commands');
  logger.info('Starting '+IMPLEMENTS+' module');
  return new CommandManager(services.eventBus, logger);
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;
