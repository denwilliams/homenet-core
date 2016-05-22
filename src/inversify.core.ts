import { injectable, inject, IKernel, IKernelModule } from "inversify";

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

const config: IConfig = require('./test-config');

@injectable()
class ConsoleLogger implements ILogger {
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
    kernel.bind<IConfig>('IConfig').toConstantValue(config);
    kernel.bind<ILogger>('ILogger').to(ConsoleLogger); //.inTransientScope();
    kernel.bind<IAuthorizer>('IAuthorizer').to(Authorizer); //.inTransientScope();
    kernel.bind<IClassesManager>('IClassesManager').to(ClassesManager).inSingletonScope();
    kernel.bind<IInstanceLoader>('IInstanceLoader').to(InstanceLoader); //.inTransientScope();
    kernel.bind<ICommandManager>('ICommandManager').to(CommandManagerImpl).inSingletonScope();
    kernel.bind<ISwitchManager>('ISwitchManager').to(SwitchManager).inSingletonScope();
    kernel.bind<ITriggerManager>('ITriggerManager').to(TriggerManager).inSingletonScope();
    kernel.bind<ISceneManager>('ISceneManager').to(SceneManager).inSingletonScope();
    kernel.bind<IStateManager>('IStateManager').to(StateManager).inSingletonScope();
    kernel.bind<IPresenceManager>('IPresenceManager').to(PresenceManagerImpl).inSingletonScope();
    kernel.bind<ISunlight>('ISunlight').to(Sunlight).inSingletonScope();
    kernel.bind<IEventBus>('IEventBus').to(SharedEventEmitter).inSingletonScope();
    kernel.bind<IWebServer>('IWebServer').to(Core.WebServer).inSingletonScope();
    kernel.bind<IApp>('IApp').to(AppImpl).inSingletonScope();
    kernel.bind<INodeRed>('INodeRed').to(NodeRed).inSingletonScope();

    kernel.bind<IZoneManager>('IZoneManager').to(ZoneManagerImpl).inSingletonScope();
    kernel.bind<ILightsManager>('ILightsManager').to(LightsManagerImpl).inSingletonScope();
    kernel.bind<ILockManager>('ILockManager').to(LockManagerImpl).inSingletonScope();
    kernel.bind<IStorageManager>('IStorageManager').to(StorageManagerImpl).inSingletonScope();
    kernel.bind<ISensorManager>('ISensorManager').to(SensorManager).inSingletonScope();

    // kernel.bind(new TypeBinding<Common>('Common', CommonImpl, TypeBindingScopeEnum.Singleton));
    // kernel.bind(new TypeBinding<LightsManager>("LightsManager", LightsManager, TypeBindingScopeEnum.Transient));
    // kernel.bind(new TypeBinding<BarInterface>("BarInterface", Bar, TypeBindingScopeEnum.Singleton));
    // kernel.bind(new TypeBinding<FooBarInterface>("FooBarInterface", FooBar));
    //
    // // Compilation error: Bar does not implement FooInterface
    // kernel.bind(new TypeBinding<FooInterface>("FooInterface", Bar));
};
