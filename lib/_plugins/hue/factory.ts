/// <reference path="../../../typings/node/node.d.ts" />
/// <reference path="../../../interfaces/interfaces.d.ts" />


var hue = require('node-hue-api');
var HueApi = hue.HueApi;
var lightState = hue.lightState;
var states = require('./hue-states');

export function factory(config : Config, lights : LightsModule, logger : Logger) : LightFactory {

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

  class HueLight implements Light {
    hub: any;
    id: string;
    state: string;
    emitOnSet: boolean = true;
    
    private _setLightState : Function;
    
    constructor(id : string, opts : any) {
      this.hub = opts.hub;
      this.id = opts.groupId;
      this.state = 'unknown';      
      var api = hubs[this.hub];
      this._setLightState = api.setGroupLightState.bind(api, this.id);
    }
    
    set(value: string|boolean) {
      this.state  = value === true ? 'full' : <string>value;
      logger.info('SET HUE LIGHT STATE TO ' + value);
      this._setLightState(getLightStateForValue(value));
    }

    get() : string {
      return this.state;    
    }
    
    turnOn() {
      this.set('full');
    }
    
    turnOff() {
      this.set('off');
    }
    
  }


  function hueLightFactory(id : string, opts : any) {
    logger.info('Adding Hue light: ' + id);
    return new HueLight(id, opts);
  }

  return hueLightFactory;
}

function getLightStateForValue(value) {
  if (value === true) return lightState.create().turnOn();
  if (value === false) return lightState.create().turnOff();
  return states[value];
}
