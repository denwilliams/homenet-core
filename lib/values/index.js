/**
 * @module values
 */
var IMPLEMENTS = 'values';
var INJECT = ['eventBus', 'logger'];
var ValuesManager = require('./values-manager.ts');

function factory(services) {
  var eventBus = services.eventBus;
  var logger = services.logger.getLogger('values');
  logger.info('Starting '+IMPLEMENTS+' module');
  return new ValuesManager(eventBus, logger);
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;
