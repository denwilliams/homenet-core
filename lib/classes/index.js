/**
 * Provides a {@link ClassesManager} instance.
 * @module classes
 * @see ClassesManager
 */
var IMPLEMENTS = 'classes';
var INJECT = ['logger'];
var ClassesManagerImpl = require('./classes-manager.ts');

function factory(services) {
  var logger = services.logger.getLogger('classes');
  logger.info('Starting '+IMPLEMENTS+' module');
  console.log(ClassesManagerImpl);
  return new ClassesManagerImpl(logger);
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;
