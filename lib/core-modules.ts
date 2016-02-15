/// <reference path="../interfaces/interfaces.d.ts"/>

import { TypeBinding, Kernel, TypeBindingScopeEnum, TypeBindingInterface } from 'inversify';

// import LightsManager = require('./lights/lights-manager');
import AppImpl = require('./core/app');
import CommonImpl = require('./core/common');
import ClassesManager = require('./core/classes-manager');
import CommandManagerImpl = require('./core/command-manager');
import SwitchManagerImpl = require('./core/switch-manager');
import SharedEventEmitter = require('./core/shared-event-emitter');

import ZoneManagerImpl = require('./core/zone-manager');
import PresenceManagerImpl = require('./core/presence-manager');

import LightsManagerImpl = require('./classes/lights-manager');
import StorageManagerImpl = require('./core/storage-manager');
import WebServer = require('./core/web-server');

class ConfigImpl implements IConfig {
  hue: any = {};
  instances: InstanceConfig[] = [];
  zones: IZoneConfig[] = [];
  locks: ILockConfig[] = [];
  people: IPersonConfig[] = [];
  dataPath: string = '';
  webServerPort: number = 1234;
  location: IConfigCoords = null
}

let config: IConfig = require('../test-config');

let configBinding: TypeBindingInterface<IConfig> = {
  runtimeIdentifier: 'config',
  implementationType: null,
  cache: config,
  scope: TypeBindingScopeEnum.Singleton
};

class ConsoleLogger implements ILogger {
  info(args : any) : void {
    console.log(args);
  }
  warn(args : any) : void {
    console.warn(args);
  }
  error(args : any) : void {
    console.error(args);
  }
  debug(args : any) : void {
    console.log(args);
  }
}

export function bindModules(kernel: Kernel) : void {
  // kernel.bind(new TypeBinding<Config>('config', ConfigImpl, TypeBindingScopeEnum.Singleton));
  kernel.bind(configBinding);
  kernel.bind(new TypeBinding<ILogger>('logger', ConsoleLogger, TypeBindingScopeEnum.Transient));
  kernel.bind(new TypeBinding<IClassesManager>('classes', ClassesManager, TypeBindingScopeEnum.Singleton));
  kernel.bind(new TypeBinding<ICommandManager>('commands', CommandManagerImpl, TypeBindingScopeEnum.Singleton));
  kernel.bind(new TypeBinding<ISwitchManager>('switches', SwitchManagerImpl, TypeBindingScopeEnum.Singleton));
  kernel.bind(new TypeBinding<IPresenceManager>('presence', PresenceManagerImpl, TypeBindingScopeEnum.Singleton));
  kernel.bind(new TypeBinding<IEventBus>('eventBus', SharedEventEmitter, TypeBindingScopeEnum.Singleton));
  kernel.bind(new TypeBinding<IWebServer>('webServer', WebServer, TypeBindingScopeEnum.Singleton));
  kernel.bind(new TypeBinding<IApp>('app', AppImpl, TypeBindingScopeEnum.Singleton));

  kernel.bind(new TypeBinding<IZoneManager>('zones', ZoneManagerImpl, TypeBindingScopeEnum.Singleton));
  kernel.bind(new TypeBinding<ILightsManager>('lights', LightsManagerImpl, TypeBindingScopeEnum.Singleton));
  kernel.bind(new TypeBinding<IStorageManager>('storage', StorageManagerImpl, TypeBindingScopeEnum.Singleton));

  // kernel.bind(new TypeBinding<Common>('Common', CommonImpl, TypeBindingScopeEnum.Singleton));
  // kernel.bind(new TypeBinding<LightsManager>("LightsManager", LightsManager, TypeBindingScopeEnum.Transient));
  // kernel.bind(new TypeBinding<BarInterface>("BarInterface", Bar, TypeBindingScopeEnum.Singleton));
  // kernel.bind(new TypeBinding<FooBarInterface>("FooBarInterface", FooBar));
  //
  // // Compilation error: Bar does not implement FooInterface
  // kernel.bind(new TypeBinding<FooInterface>("FooInterface", Bar));
};
