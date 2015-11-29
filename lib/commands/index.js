/**
 * 
 * @module commands
 */

var IMPLEMENTS = 'commands';
var INJECT = ['logger', 'eventBus'];
var CommandManagerImpl = require('./command-manager.ts');

function factory(services) {
  var logger = services.logger.getLogger('commands');
  logger.info('Starting '+IMPLEMENTS+' module');
  return new CommandManagerImpl(services.eventBus, logger);
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;
