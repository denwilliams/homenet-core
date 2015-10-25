var hue = require('node-hue-api');
var HueApi = hue.HueApi;
var lightState = hue.lightState;

function createVirtualLightFactory(config, lights, logger) {

  var hubs = {};

  if (config.hue && config.hue.hubs) {
    config.hue.hubs.forEach(function(hub) {
      var id = hub.id;
      var name = hub.name;
      var host = hub.host;
      var key = hub.key;
      logger.info('Setting up hub ' + name + ' (' + id + ') on ' + host);
      var hubApi = hubs[id] = new HueApi(host, key);
      debugPrintHub(hub, hubApi);
    });
  }

  function debugPrintHub(hub, hubApi) {
    hubApi.lights()
      .then(function(result) {
        result.lights.forEach(function(light) {
          logger.debug('Found Hue light: [' + hub.id + ':' + light.id + '] ' + light.name + ' (' + light.type + ')');
        });
      })
      .fail(logError)
      .done();
    hubApi.groups()
      .then(function(groups) {
        groups.forEach(function(group) {
          logger.debug('Found Hue group: [' + hub.id + ':g' + group.id + '] ' + group.name);
        });
      })
      .fail(logError)
      .done();
  }

  function logError(err) {
    logger.error(err.toString());
  }

  function HueLight(id, opts) {
    this.hub = opts.hub;
    this.id = opts.id;
    this.state = 'unknown';
    
    var api = hubs[this.hub];
    this._setLightState = api.setLightState.bind(api, this.id);
  }
  HueLight.prototype.set = function(value, done) {
    this.state  = value;
    logger.info('SET HUE LIGHT STATE TO ' + value);
    this._setLightState(getLightStateForValue(value));
    if (done) done();
  };
  HueLight.prototype.get = function() {
    return this.state;
  };

  function hueLightFactory(id, opts) {
    logger.info('Adding Hue light: ' + id);
    return new HueLight(id, opts);
  }

  return hueLightFactory;
}

function getLightStateForValue(value) {
  if (value === true) return lightState.create().turnOn();
  if (value === false) return lightState.create().turnOff();
  return lightState.turnOff();
}

module.exports = exports = createVirtualLightFactory;
