import {inject, injectable} from 'inversify';

import VirtualPluginLoader = require('./virtual/index');
import HuePluginLoader = require('./hue/index');

@injectable()
class DefaultPlugins {

  private _plugins : IPlugins;
  private _toLoad : IPluginLoader[];

  constructor(
        @inject('IPlugins') plugins: IPlugins,
        @inject('ILightsManager') lights: ILightsManager,
        @inject('ILockManager') locks: ILockManager,
        @inject('IEventBus') eventBus: IEventBus,
        @inject('IConfig') config: IConfig,
        @inject('ILogger') logger: ILogger) {
    this._plugins = plugins;
    this._toLoad = [
      // new HuePluginLoader(config, lights, logger),
      new VirtualPluginLoader(lights, locks, eventBus, logger)
    ];
  }

  addDefault() {
    this._toLoad.forEach(item => this._plugins.add(item));
  }
}

export = DefaultPlugins;
