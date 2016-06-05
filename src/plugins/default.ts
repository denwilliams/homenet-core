import {inject, injectable} from 'inversify';

import VirtualPluginLoader = require('./virtual');

@injectable()
class DefaultPlugins {

  private _plugins : Homenet.IPlugins;
  private _toLoad : Homenet.IPluginLoader[];

  constructor(
        @inject('IPlugins') plugins: Homenet.IPlugins,
        @inject('IPresenceManager') presence: Homenet.IPresenceManager,
        @inject('IValuesManager') values: Homenet.IValuesManager,
        @inject('ITriggerManager') triggers: Homenet.ITriggerManager,
        @inject('ILightsManager') lights: Homenet.ILightsManager,
        @inject('ILockManager') locks: Homenet.ILockManager,
        @inject('ISensorManager') sensors: Homenet.ISensorManager,
        @inject('IEventBus') eventBus: Homenet.IEventBus,
        @inject('IConfig') config: Homenet.IConfig,
        @inject('ILogger') logger: Homenet.ILogger) {
    this._plugins = plugins;
    this._toLoad = [
      new VirtualPluginLoader(lights, presence, values, triggers, locks, sensors, eventBus, logger)
    ];
  }

  addDefault() {
    this._toLoad.forEach(item => this._plugins.add(item));
  }
}

export = DefaultPlugins;
