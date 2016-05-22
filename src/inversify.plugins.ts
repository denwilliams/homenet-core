import { injectable, inject, IKernel, IKernelModule } from "inversify";

import VirtualPluginLoader = require('./plugins/virtual/index');
import HuePluginLoader = require('./plugins/hue/index');
import DefaultPlugins = require('./plugins/default');

// import LightsManager = require('./lights/lights-manager');
import ClassTypeManager = require('./utils/class-type-manager');

@injectable()
class Plugins implements IPlugins {
  private _loaders : IPluginLoader[];

  constructor() {
    this._loaders = [];
  }

  add(loader: IPluginLoader) : void {
    this._loaders.push(loader);
  }

  loadAll() : void {
    console.log('Loading plugins...');
    this._loaders.forEach((loader: IPluginLoader) => {
      loader.load();
    });
  }
}


export const pluginsModule: IKernelModule = (kernel: IKernel) => {
  console.log('Binding plugins modules');
  kernel.bind<HuePluginLoader>('HuePluginLoader').to(HuePluginLoader);
  kernel.bind<VirtualPluginLoader>('VirtualPluginLoader').to(VirtualPluginLoader);
  kernel.bind<IPlugins>('IPlugins').to(Plugins);
  kernel.bind<DefaultPlugins>('DefaultPlugins').to(DefaultPlugins);
};
