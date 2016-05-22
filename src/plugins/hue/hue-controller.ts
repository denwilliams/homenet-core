import * as _ from 'lodash';

const hue = require('node-hue-api');
// import hueHub = require('./hue-hub');
const HueApi = hue.HueApi;

interface IHubConfig {id:string, name:string, host:string, key:string}

class HueController {

  private _hubs: Dict<IHueApi>;
  private _logger: ILogger;

  constructor(config: IConfig, logger: ILogger) {
    this._hubs = createHubs(config.hue.hubs, logger);
    this._logger = logger;
  }

  getHub(hubId: string) : IHueApi {
    return this._hubs[hubId];
  }

  setGroupLightState(hubId: string, groupId: string, value: any) : void {
    this._logger.info('Setting light for ' + hubId + groupId);
    this.getHub(hubId).setGroupLightState(groupId, value);
  }
}

function createHubs(hubs: Array<IHubConfig>, logger: ILogger) : Dict<IHueApi> {
  const res : Dict<IHueApi> = {};
  hubs.forEach(function(hub: IHubConfig) {
    const id = hub.id;
    const name = hub.name;
    const host = hub.host;
    const key = hub.key;

    logger.info('Setting up Hue hub ' + name + ' (' + id + ') on ' + host);

    const hubApi: IHueApi = createHub(host, key);
    // debugPrintHub(hub, hubApi);
    res[id] = hubApi;
  });

  return res;
}

function createHub(host: string, key: string) : IHueApi {
  return new HueApi(host, key);
}

export = HueController;
