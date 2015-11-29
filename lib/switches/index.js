/**
 * @module switches
 * @see module:switches.SwitchManager
 */

var IMPLEMENTS = 'switches';
var INJECT = ['logger', 'eventBus'];
var SwitchManager = require('./switch-manager.ts');

function factory(services) {
  var logger = services.logger.getLogger('switches');
  logger.info('Starting '+IMPLEMENTS+' module');
  return new SwitchManager(services.eventBus, logger);
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;
