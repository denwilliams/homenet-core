/**
 * Fires sunlight based events provided a latitude and longitude.
 * Returns a {@link module:sunlight.SunlightMonitor} instance.
 * @module sunlight
 * @see module:sunlight.SunlightMonitor
 */

var MODULE_NAME = 'sunlight';
var IMPLEMENTS = MODULE_NAME;
var INJECT = ['logger', 'config', 'states'];
var STATE_TYPE = MODULE_NAME;
var sunlightMonitor = require('./sunlight-monitor');

function factory(services) {
  var logger = services.logger.getLogger('sunlight');
  var states = services.states;
  var config = services.config;
  var location = config.location || {};
  
  var monitor = sunlightMonitor.monitor({
    logger: logger,
    latitude: location.latitude,
    longitude: location.longitude
  });

  monitor.on('light', function(lightState) {
    states.emitState(STATE_TYPE, lightState.value);
  });
  
  states.addType(STATE_TYPE, {
    getCurrent: function() {
      return monitor.current;
    }
  });

 return monitor;
}

module.exports = exports = factory;
exports.$implements = IMPLEMENTS;
exports.$inject = INJECT;

