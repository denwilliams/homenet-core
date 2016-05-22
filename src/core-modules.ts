// import { TypeBinding, Kernel, TypeBindingScopeEnum } from 'inversify';
// // import { TypeBinding, Kernel, TypeBindingScopeEnum, TypeBindingInterface } from 'inversify';
// // import * as inversify from 'inversify';
// // const TypeBinding = inversify.TypeBinding;
// // const Kernel = inversify.Kernel;
// // const TypeBindingScopeEnum = inversify.TypeBindingScopeEnum;
// // const TypeBindingInterface = inversify.TypeBindingInterface;
//
// // import LightsManager = require('./lights/lights-manager');
// import AppImpl = require('./core/app');
// import CommonImpl = require('./core/common');
// import ClassesManager = require('./core/classes-manager');
// import CommandManagerImpl = require('./core/command-manager');
// import SwitchManager = require('./core/switch-manager');
// import SharedEventEmitter = require('./core/shared-event-emitter');
//
// import ZoneManagerImpl = require('./core/zone-manager');
// import PresenceManagerImpl = require('./core/presence-manager');
// import StorageManagerImpl = require('./core/storage-manager');
// import StateManagerImpl = require('./core/state-manager');
// import InstanceLoader = require('./core/instance-loader');
//
// import LightsManagerImpl = require('./classes/lights-manager');
// import LockManagerImpl = require('./classes/lock-manager');
// import PersonManager = require('./classes/person-manager');
//
// import Core = require('./core/index');
//
// class ConfigImpl implements IConfig {
//   hue: any = {};
//   instances: InstanceConfig[] = [];
//   zones: IZoneConfig[] = [];
//   locks: ILockConfig[] = [];
//   people: IPersonConfig[] = [];
//   dataPath: string = '';
//   webServerPort: number = 1234;
//   location: IConfigCoords = null
// }
//
// let config: IConfig = require('../test-config');
//
// let configBinding: any /*TypeBindingInterface<IConfig>*/ = {
//   runtimeIdentifier: 'IConfig',
//   implementationType: null,
//   cache: config,
//   scope: TypeBindingScopeEnum.Singleton
// };
//
// class ConsoleLogger implements ILogger {
//   info(args : any) : void {
//     console.log(args);
//   }
//   warn(args : any) : void {
//     console.warn(args);
//   }
//   error(args : any) : void {
//     console.error(args);
//   }
//   debug(args : any) : void {
//     console.log(args);
//   }
// }
//
// export function bindModules(kernel: Kernel) : void {
//   // kernel.bind(new TypeBinding<IConfig>('IConfig', ConfigImpl, TypeBindingScopeEnum.Singleton));
//   kernel.bind(configBinding);
//   kernel.bind(new TypeBinding<ILogger>('ILogger', ConsoleLogger, TypeBindingScopeEnum.Transient));
//   kernel.bind(new TypeBinding<IClassesManager>('IClassesManager', ClassesManager, TypeBindingScopeEnum.Singleton));
//   kernel.bind(new TypeBinding<IInstanceLoader>('IInstanceLoader', InstanceLoader, TypeBindingScopeEnum.Transient));
//   kernel.bind(new TypeBinding<ICommandManager>('ICommandManager', CommandManagerImpl, TypeBindingScopeEnum.Singleton));
//   kernel.bind(new TypeBinding<ISwitchManager>('ISwitchManager', SwitchManager, TypeBindingScopeEnum.Singleton));
//   kernel.bind(new TypeBinding<IPresenceManager>('IPresenceManager', PresenceManagerImpl, TypeBindingScopeEnum.Singleton));
//   kernel.bind(new TypeBinding<IEventBus>('IEventBus', SharedEventEmitter, TypeBindingScopeEnum.Singleton));
//   kernel.bind(new TypeBinding<IWebServer>('IWebServer', Core.WebServer, TypeBindingScopeEnum.Singleton));
//   kernel.bind(new TypeBinding<IApp>('IApp', AppImpl, TypeBindingScopeEnum.Singleton));
//
//   kernel.bind(new TypeBinding<IZoneManager>('IZoneManager', ZoneManagerImpl, TypeBindingScopeEnum.Singleton));
//   kernel.bind(new TypeBinding<ILightsManager>('ILightsManager', LightsManagerImpl, TypeBindingScopeEnum.Singleton));
//   kernel.bind(new TypeBinding<ILockManager>('ILockManager', LockManagerImpl, TypeBindingScopeEnum.Singleton));
//   kernel.bind(new TypeBinding<IStorageManager>('IStorageManager', StorageManagerImpl, TypeBindingScopeEnum.Singleton));
//
//   // kernel.bind(new TypeBinding<Common>('Common', CommonImpl, TypeBindingScopeEnum.Singleton));
//   // kernel.bind(new TypeBinding<LightsManager>("LightsManager", LightsManager, TypeBindingScopeEnum.Transient));
//   // kernel.bind(new TypeBinding<BarInterface>("BarInterface", Bar, TypeBindingScopeEnum.Singleton));
//   // kernel.bind(new TypeBinding<FooBarInterface>("FooBarInterface", FooBar));
//   //
//   // // Compilation error: Bar does not implement FooInterface
//   // kernel.bind(new TypeBinding<FooInterface>("FooInterface", Bar));
// };
