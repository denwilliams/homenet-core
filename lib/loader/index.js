/**
 * Provides an {@link InstanceLoader} that loads or creates instances from configuration when `.load()` is called.
 * @module loader
 * @see InstanceLoader
 */
var IMPLEMENTS = 'loader';
var INJECT = ['classes', 'config', 'logger'];
var InstanceLoader = require('./instance-loader');

function factory(services) {
  var classes = services.classes;
  var config = services.config;
  var logger = services.logger.getLogger('loader');
  return new InstanceLoader(classes, config, logger);
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;
