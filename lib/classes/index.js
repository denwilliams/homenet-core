/**
 * Provides a {@link ClassesManager} instance.
 * @module classes
 * @see ClassesManager
 */
var IMPLEMENTS = 'classes';
var INJECT = ['logger'];
var ClassesManager = require('./classes-manager');

function factory(services) {
  var logger = services.logger.getLogger('classes');
  logger.info('Starting '+IMPLEMENTS+' module');
  return new ClassesManager(logger);
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;
