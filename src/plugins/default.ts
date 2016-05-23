import {inject, injectable} from 'inversify';
// import {Homenet} from '../interfaces.d.ts';

import VirtualPluginLoader = require('./virtual/index');
import HuePluginLoader = require('./hue/index');

@injectable()
class DefaultPlugins {

  private _plugins : Homenet.IPlugins;
  private _toLoad : Homenet.IPluginLoader[];

  constructor(
        @inject('IPlugins') plugins: Homenet.IPlugins,
        @inject('ILightsManager') lights: Homenet.ILightsManager,
        @inject('ILockManager') locks: Homenet.ILockManager,
        @inject('IEventBus') eventBus: Homenet.IEventBus,
        @inject('IConfig') config: Homenet.IConfig,
        @inject('ILogger') logger: Homenet.ILogger) {
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
