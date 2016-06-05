/// <reference path="./hue-api.d.ts"/>
// import {Homenet} from '../../interfaces.d.ts';

const hue = require('node-hue-api');
const HueApi = hue.HueApi;
const lightState = hue.lightState;

import HueController = require('./hue-controller');
import STATES = require('./hue-states');
import {EventEmitter} from 'events';

class HueLight extends EventEmitter implements Homenet.ILight {
  // hub: any;
  // id: string;
  state: string;
  // emitOnSet: boolean = true;

  private _setLightState : Function;
  private _controller: HueController;
  private _logger: Homenet.ILogger;

  constructor(id : string, opts : any, controller: HueController, logger: Homenet.ILogger) {
    super();

    this._logger = logger;
    this.state = 'unknown';

    const hubId = opts.hub;
    const groupId = opts.groupId;

    this._setLightState = (controller.setGroupLightState).bind(controller, hubId, groupId);
  }

  set(value: string|boolean) {
    this.state  = value === true ? 'full' : <string>value;
    this._logger.info('SET HUE LIGHT STATE TO ' + value);
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

  emitValue(value: boolean|string|number) : void {
    // TODO:
  }

}

function getLightStateForValue(value: string|boolean) : string {
  if (value === true) return lightState.create().turnOn();
  if (value === false) return lightState.create().turnOff();
  return STATES[<string> value];
}

export = HueLight;
