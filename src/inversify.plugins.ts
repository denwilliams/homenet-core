/// <reference path="./interfaces.d.ts"/>

import { injectable, inject, IKernel, IKernelModule } from "inversify";
// import { Homenet } from './interfaces.d.ts';

import { VirtualPluginLoader } from './plugins/virtual/index';
import DefaultPlugins = require('./plugins/default');

// import LightsManager = require('./lights/lights-manager');
import { ClassTypeManager } from './utils/class-type-manager';

@injectable()
class Plugins implements Homenet.IPlugins {
  private _loaders : Homenet.IPluginLoader[];

  constructor() {
    this._loaders = [];
  }

  add(loader: Homenet.IPluginLoader) : void {
    this._loaders.push(loader);
  }

  loadAll() : void {
    console.log('Loading plugins...');
    this._loaders.forEach((loader: Homenet.IPluginLoader) => {
      loader.load();
    });
  }
}


export const pluginsModule: IKernelModule = (kernel: IKernel) => {
  kernel.bind<VirtualPluginLoader>('VirtualPluginLoader').to(VirtualPluginLoader);
  kernel.bind<Homenet.IPlugins>('IPlugins').to(Plugins);
  kernel.bind<DefaultPlugins>('DefaultPlugins').to(DefaultPlugins);
};
