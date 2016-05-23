/// <reference path="./interfaces.d.ts"/>

import { injectable, inject, IKernel, IKernelModule } from "inversify";
// import {Homenet} from './interfaces.d.ts';

// import LightsManager = require('./lights/lights-manager');
import AppImpl = require('./core/app');
import CommonImpl = require('./core/common');
import ClassesManager = require('./core/classes-manager');
import CommandManagerImpl = require('./core/command-manager');
import SwitchManager = require('./core/switch-manager');
import SharedEventEmitter = require('./core/shared-event-emitter');

import { TriggerManager } from './core/trigger-manager';
import { StateManager } from './core/state-manager';
import { SceneManager } from './core/scene-manager';
import { Sunlight } from './core/sunlight';
import { SensorManager } from './core/sensor-manager';
import { NodeRed } from './core/node-red';

import { Authorizer } from './core/authorizer';

import ZoneManagerImpl = require('./core/zone-manager');
import PresenceManagerImpl = require('./core/presence-manager');
import StorageManagerImpl = require('./core/storage-manager');
import StateManagerImpl = require('./core/state-manager');
import InstanceLoader = require('./core/instance-loader');

import LightsManagerImpl = require('./classes/lights-manager');
import LockManagerImpl = require('./classes/lock-manager');
import PersonManager = require('./classes/person-manager');

import Core = require('./core/index');

@injectable()
class ConfigImpl implements Homenet.IConfig {
  hue: any = {};
  instances: Homenet.InstanceConfig[] = [];
  zones: Homenet.IZoneConfig[] = [];
  locks: Homenet.ILockConfig[] = [];
  people: Homenet.IPersonConfig[] = [];
  dataPath: string = '';
  webServerPort: number = 1234;
  location: Homenet.IConfigCoords = null
}

const config: Homenet.IConfig = require('./test-config');

@injectable()
class ConsoleLogger implements Homenet.ILogger {
  constructor() {}

  info(args : any) : void {
    console.log('INFO', args);
  }
  warn(args : any) : void {
    console.warn('WARN', args);
  }
  error(args : any) : void {
    console.error('ERRO', args);
  }
  debug(args : any) : void {
    console.log('DEBG', args);
  }
}


export const coreModule: IKernelModule = (kernel: IKernel) => {
    // kernel.bind(new TypeBinding<IConfig>('IConfig', ConfigImpl, TypeBindingScopeEnum.Singleton));
    kernel.bind<Homenet.IConfig>('IConfig').toConstantValue(config);
    kernel.bind<Homenet.ILogger>('ILogger').to(ConsoleLogger); //.inTransientScope();
    kernel.bind<Homenet.IAuthorizer>('IAuthorizer').to(Authorizer); //.inTransientScope();
    kernel.bind<Homenet.IClassesManager>('IClassesManager').to(ClassesManager).inSingletonScope();
    kernel.bind<Homenet.IInstanceLoader>('IInstanceLoader').to(InstanceLoader); //.inTransientScope();
    kernel.bind<Homenet.ICommandManager>('ICommandManager').to(CommandManagerImpl).inSingletonScope();
    kernel.bind<Homenet.ISwitchManager>('ISwitchManager').to(SwitchManager).inSingletonScope();
    kernel.bind<Homenet.ITriggerManager>('ITriggerManager').to(TriggerManager).inSingletonScope();
    kernel.bind<Homenet.ISceneManager>('ISceneManager').to(SceneManager).inSingletonScope();
    kernel.bind<Homenet.IStateManager>('IStateManager').to(StateManager).inSingletonScope();
    kernel.bind<Homenet.IPresenceManager>('IPresenceManager').to(PresenceManagerImpl).inSingletonScope();
    kernel.bind<Homenet.ISunlight>('ISunlight').to(Sunlight).inSingletonScope();
    kernel.bind<Homenet.IEventBus>('IEventBus').to(SharedEventEmitter).inSingletonScope();
    kernel.bind<Homenet.IWebServer>('IWebServer').to(Core.WebServer).inSingletonScope();
    kernel.bind<Homenet.IApp>('IApp').to(AppImpl).inSingletonScope();
    kernel.bind<Homenet.INodeRed>('INodeRed').to(NodeRed).inSingletonScope();

    kernel.bind<Homenet.IZoneManager>('IZoneManager').to(ZoneManagerImpl).inSingletonScope();
    kernel.bind<Homenet.ILightsManager>('ILightsManager').to(LightsManagerImpl).inSingletonScope();
    kernel.bind<Homenet.ILockManager>('ILockManager').to(LockManagerImpl).inSingletonScope();
    kernel.bind<Homenet.IStorageManager>('IStorageManager').to(StorageManagerImpl).inSingletonScope();
    kernel.bind<Homenet.ISensorManager>('ISensorManager').to(SensorManager).inSingletonScope();

    // kernel.bind(new TypeBinding<Common>('Common', CommonImpl, TypeBindingScopeEnum.Singleton));
    // kernel.bind(new TypeBinding<LightsManager>("LightsManager", LightsManager, TypeBindingScopeEnum.Transient));
    // kernel.bind(new TypeBinding<BarInterface>("BarInterface", Bar, TypeBindingScopeEnum.Singleton));
    // kernel.bind(new TypeBinding<FooBarInterface>("FooBarInterface", FooBar));
    //
    // // Compilation error: Bar does not implement FooInterface
    // kernel.bind(new TypeBinding<FooInterface>("FooInterface", Bar));
};
