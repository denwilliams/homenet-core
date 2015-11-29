/**
 * @module states
 * @see module:states.StateManager
 */
var IMPLEMENTS = 'states';
var INJECT = ['logger', 'eventBus'];
var StateManager = require('./manager');

function factory(services) {
  var logger = services.logger.getLogger('states');
  logger.info('Starting '+IMPLEMENTS+' module');
  return new StateManager(services.eventBus, logger);
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;
