/**
 * Fires sunlight based events provided a latitude and longitude.
 * Returns a {@link module:sunlight.SunlightMonitor} instance.
 * @module sunlight
 * @see module:sunlight.SunlightMonitor
 */

var IMPLEMENTS = 'sunlight';
var INJECT = ['logger', 'config'];
var sunlightMonitor = require('./sunlight-monitor');

function factory(services) {
  var logger = services.logger.getLogger('sunlight');
  var config = services.config;
  var location = config.location || {};
  return sunlightMonitor.monitor({
    logger: logger,
    latitude: location.latitude,
    longitude: location.longitude
  });
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;

