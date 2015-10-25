/**
 * Heirarchical zone map
 * @module zone
 * @requires module:presence
 */
module.exports = exports = factory;
exports.$implements = 'zone';
exports.$inject = ['logger', 'config', 'presence'];

var ZoneManager = require('./zone-manager');

function factory(services) {
  var presence = services.presence;
  var config = services.config;
  return new ZoneManager(presence, config, services.logger.getLogger('zone'));
}
