/// <reference path="./hue-api.d.ts"/>

import {inject, injectable} from 'inversify';
// import {Homenet} from '../../interfaces.d.ts';

// var hue = require('node-hue-api');
// var lightState = hue.lightState;

// import HueLight = require('./hue-light')
import HueController = require('./hue-controller');
import HueLight = require('./hue-light');


// import lightFactory = require('./lights');
// import createLockFactory = require('./lock');

@injectable()
class HuePluginLoader implements Homenet.IPluginLoader {

  private _logger : Homenet.ILogger;
  private _config : Homenet.IConfig;
  private _lights : Homenet.ILightsManager;
  private _controller : HueController;

  constructor(
          @inject('IConfig') config: Homenet.IConfig,
          @inject('ILightsManager') lights: Homenet.ILightsManager,
          @inject('ILogger') logger: Homenet.ILogger) {
    this._logger = logger;
    this._lights = lights;
    this._logger = logger;
    this._controller = new HueController(config, logger);

    let lightFactory: Homenet.ILightFactory;
    lightFactory = this._hueLightFactory.bind(this);
    lights.addType('hue', lightFactory);
  }

  load() : void {
    this._logger.info('Loading hue lights');
  }

  _hueLightFactory(id : string, opts : any) : Homenet.ILight {
    this._logger.info('Adding Hue light: ' + id);
    return new HueLight(id, opts, this._controller, this._logger);
  }
  //
  //
  // factory(config: IConfig, lights: ILightsManager, logger: ILogger) : ILightFactory {
  //
  //   // var hubs: Dict<IHueApi> = {};
  //   var controller = new HueController(config, logger);
  //   //
  //   // if (config.hue && config.hue.hubs) {
  //   //   config.hue.hubs.forEach(function(hub: {id:string, name:string, host:string, key:string}) {
  //   //     var id = hub.id;
  //   //     var name = hub.name;
  //   //     var host = hub.host;
  //   //     var key = hub.key;
  //   //
  //   //     logger.info('Setting up hub ' + name + ' (' + id + ') on ' + host);
  //   //
  //   //     var hubApi: IHueApi = hueHub.create(host, key);
  //   //     debugPrintHub(hub, hubApi);
  //   //     hubs[id] = hubApi;
  //   //   });
  //   // }
  //   //
  //   //
  //   // function logError(err: Error) {
  //   //   logger.error(err.toString());
  //   // }
  //   //
  //
  //   return hueLightFactory;
  // }
}

export = HuePluginLoader;


//
// function createHubs(hubs: Array<IHubConfig>, logger: ILogger) : Dict<IHueApi> {
//   return _.keyBy(hubs.map(function(hub: IHubConfig) {
//     var id = hub.id;
//     var name = hub.name;
//     var host = hub.host;
//     var key = hub.key;
//
//     logger.info('Setting up hub ' + name + ' (' + id + ') on ' + host);
//
//     var hubApi: IHueApi = hueHub.create(host, key);
//     debugPrintHub(hub, hubApi);
//     hubs[id] = hubApi;
//   }), 'id');
// }

//
// function debugPrintHub(hub: any, hubApi: any) {
//   hubApi.lights()
//   .then(function(result: {lights: {id: string, name: string, type:string}[]}) {
//     result.lights.forEach(function(light) {
//       logger.debug('Found Hue light: [' + hub.id + ':' + light.id + '] ' + light.name + ' (' + light.type + ')');
//     });
//   })
//   .fail(logError)
//   .done();
//
//   hubApi.groups()
//   .then(function(groups: any[]) {
//     groups.forEach(function(group: {id:string, name:string}) {
//       logger.debug('Found Hue group: [' + hub.id + ':g' + group.id + '] ' + group.name);
//     });
//   })
//   .fail(logError)
//   .done();
// }
