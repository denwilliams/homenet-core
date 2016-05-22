// import { TypeBinding, Kernel, TypeBindingScopeEnum } from 'inversify';
// import VirtualPluginLoader = require('./plugins/virtual/index');
// import HuePluginLoader = require('./plugins/hue/index');
// import DefaultPlugins = require('./plugins/default');
//
// // import LightsManager = require('./lights/lights-manager');
// import ClassTypeManager = require('./utils/class-type-manager');
//
// class Plugins implements IPlugins {
//   private _loaders : IPluginLoader[];
//
//   constructor() {
//     this._loaders = [];
//   }
//
//   add(loader: IPluginLoader) : void {
//     this._loaders.push(loader);
//   }
//
//   loadAll() : void {
//     console.log('Loading plugins...');
//     this._loaders.forEach((loader: IPluginLoader) => {
//       loader.load();
//     });
//   }
// }
//
// export function bindModules(kernel: Kernel) : void {
//   console.log('Binding plugins modules');
//   kernel.bind(new TypeBinding<HuePluginLoader>('HuePluginLoader', HuePluginLoader));
//   kernel.bind(new TypeBinding<VirtualPluginLoader>('VirtualPluginLoader', VirtualPluginLoader));
//   kernel.bind(new TypeBinding<IPlugins>('IPlugins', Plugins));
//   kernel.bind(new TypeBinding<DefaultPlugins>('DefaultPlugins', DefaultPlugins));
// };
