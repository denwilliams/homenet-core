/// <reference path="../../interfaces.d.ts"/>

import {inject, injectable} from 'inversify';
// import {Homenet} from '../../interfaces.d.ts';
import lightFactory = require('./lights');
import createLockFactory = require('./lock');
import {createSensorsFactory} from './sensors';

@injectable()
export class VirtualPluginLoader implements Homenet.IPluginLoader {
  private _logger : Homenet.ILogger;

  constructor(
          @inject('ILightsManager') lights: Homenet.ILightsManager,
          @inject('IPresenceManager') presence: Homenet.IPresenceManager,
          @inject('IValuesManager') values: Homenet.IValuesManager,
          @inject('ITriggerManager') triggers: Homenet.ITriggerManager,
          @inject('ILockManager') locks: Homenet.ILockManager,
          @inject('ISensorManager') sensors: Homenet.ISensorManager,
          @inject('IEventBus') eventBus: Homenet.IEventBus,
          @inject('ILogger') logger: Homenet.ILogger) {
    this._logger = logger;
    sensors.addType('virtual', createSensorsFactory())
    lights.addType('virtual', lightFactory);
    locks.addSettableType('virtual', createLockFactory(eventBus));
  }

  load() : void {
    this._logger.info('Loading virtual lights');
  }
}
