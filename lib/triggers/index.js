/**
 * @module triggers
 */

var IMPLEMENTS = 'triggers';
var INJECT = ['logger', 'eventBus'];
var TriggerManager = require('./trigger-manager');

function factory(services) {
  var logger = services.logger.getLogger('triggers');
  return new TriggerManager(services.eventBus, logger);
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;
