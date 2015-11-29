/**
 * The presence module maintains presence state for entities such as devices and zones.
 * The presence module is more like a "repository" of {@link module:presence.PresenceState|PresenceState}s.
 * Altering the state of base presence items must be done from other modules, however ths presence
 * module maintains a heirarchical presence state for items such as rooms and zones.
 * Injecting {@link module:presence|presence} will provide a {@link module:presence.PresenceManager|PresenceManager} instance.
 * @module presence
 */

var IMPLEMENTS = 'presence';
var INJECT = ['logger'];

var PresenceManager = require('./manager');

function factory(services) {
  var logger = services.logger.getLogger('presence');
  return new PresenceManager(logger);
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;
