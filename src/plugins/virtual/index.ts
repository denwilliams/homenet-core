import {inject, injectable} from 'inversify';
import lightFactory = require('./lights');
import createLockFactory = require('./lock');

@injectable()
class VirtualPluginLoader implements IPluginLoader {
  private _logger : ILogger;

  constructor(
          @inject('ILightsManager') lights: ILightsManager,
          @inject('ILockManager') locks: ILockManager, 
          @inject('IEventBus') eventBus: IEventBus,
          @inject('ILogger') logger: ILogger) {
    this._logger = logger;
    lights.addType('virtual', lightFactory);
    locks.addType('virtual', createLockFactory(eventBus));
  }

  load() : void {
    this._logger.info('Loading virtual lights');
  }
}

export = VirtualPluginLoader;
