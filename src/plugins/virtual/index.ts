/// <reference path="../../interfaces.d.ts"/>

import {inject, injectable} from 'inversify';
// import {Homenet} from '../../interfaces.d.ts';
import lightFactory = require('./lights');
import createLockFactory = require('./lock');

@injectable()
class VirtualPluginLoader implements Homenet.IPluginLoader {
  private _logger : Homenet.ILogger;

  constructor(
          @inject('ILightsManager') lights: Homenet.ILightsManager,
          @inject('ILockManager') locks: Homenet.ILockManager,
          @inject('IEventBus') eventBus: Homenet.IEventBus,
          @inject('ILogger') logger: Homenet.ILogger) {
    this._logger = logger;
    lights.addType('virtual', lightFactory);
    locks.addType('virtual', createLockFactory(eventBus));
  }

  load() : void {
    this._logger.info('Loading virtual lights');
  }
}

export = VirtualPluginLoader;
