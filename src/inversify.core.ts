import { injectable, inject, IKernel, IKernelModule } from "inversify";
import * as chalk from 'chalk';
// import {Homenet} from './interfaces.d.ts';

// import LightsManager = require('./lights/lights-manager');
import { App } from './core/app';
import { Common } from './core/common';
import ClassesManager = require('./core/classes-manager');
import CommandManagerImpl = require('./core/command-manager');
import SwitchManager = require('./core/switch-manager');
import SharedEventEmitter = require('./core/shared-event-emitter');

import { NodeRed } from './core/node-red';
import { GlobalContext } from './core/global-context';
import { SceneManager } from './core/scene-manager';
import { InstanceLoader } from './core/instance-loader';
import { Authorizer } from './core/authorizer';

// low level
import { TriggerManager } from './core/trigger-manager';
import { ValuesManager } from './core/values-manager';
import { StateManager } from './core/state-manager';
import { PresenceManager } from './core/presence-manager';
import { StorageManager } from './core/storage-manager';

// core functions
import { Sunlight } from './core/sunlight';
import { ZoneManager } from './core/zone-manager';

// higher level
import { SensorManager } from './core/sensor-manager';
import { LightsManager } from './classes/lights-manager';
import { LockManager } from './classes/lock-manager';
import PersonManager = require('./classes/person-manager');

import Core = require('./core/index');

// @injectable()
// class ConfigImpl implements Homenet.IConfig {
//   hue: any = {};
//   instances: Homenet.InstanceConfig[] = [];
//   zones: Homenet.IZoneConfig[] = [];
//   locks: Homenet.ILockConfig[] = [];
//   people: Homenet.IPersonConfig[] = [];
//   dataPath: string = '';
//   webServerPort: number = 1234;
//   location: Homenet.IConfigCoords = null
// }

// const config: Homenet.IConfig = require('./test-config');

@injectable()
class ConsoleLogger implements Homenet.ILogger {
  constructor() {}

  info(args : any) : void {
    console.log(chalk.green('INFO'), args);
  }
  warn(args : any) : void {
    console.warn(chalk.yellow('WARN'), args);
  }
  error(args : any) : void {
    console.error(chalk.red('ERRO'), args);
  }
  debug(args : any) : void {
    console.log(chalk.blue('DEBG'), args);
  }
}


export const coreModule: IKernelModule = (kernel: IKernel) => {
    // kernel.bind(new TypeBinding<IConfig>('IConfig', ConfigImpl, TypeBindingScopeEnum.Singleton));
    kernel.bind<Homenet.ILogger>('ILogger').to(ConsoleLogger); //.inTransientScope();
    kernel.bind<Homenet.IAuthorizer>('IAuthorizer').to(Authorizer); //.inTransientScope();
    kernel.bind<Homenet.IClassesManager>('IClassesManager').to(ClassesManager).inSingletonScope();
    kernel.bind<Homenet.IInstanceLoader>('IInstanceLoader').to(InstanceLoader); //.inTransientScope();
    kernel.bind<Homenet.ICommandManager>('ICommandManager').to(CommandManagerImpl).inSingletonScope();
    kernel.bind<Homenet.ISwitchManager>('ISwitchManager').to(SwitchManager).inSingletonScope();
    kernel.bind<Homenet.ITriggerManager>('ITriggerManager').to(TriggerManager).inSingletonScope();
    kernel.bind<Homenet.IValuesManager>('IValuesManager').to(ValuesManager).inSingletonScope();
    kernel.bind<Homenet.ISceneManager>('ISceneManager').to(SceneManager).inSingletonScope();
    kernel.bind<Homenet.IStateManager>('IStateManager').to(StateManager).inSingletonScope();
    kernel.bind<Homenet.IPresenceManager>('IPresenceManager').to(PresenceManager).inSingletonScope();
    kernel.bind<Homenet.ISunlight>('ISunlight').to(Sunlight).inSingletonScope();
    kernel.bind<Homenet.IEventBus>('IEventBus').to(SharedEventEmitter).inSingletonScope();
    kernel.bind<Homenet.IWebServer>('IWebServer').to(Core.WebServer).inSingletonScope();
    kernel.bind<Homenet.IApp>('IApp').to(App).inSingletonScope();

    kernel.bind<Homenet.INodeREDContext>('INodeREDContext').to(GlobalContext).inSingletonScope();
    kernel.bind<Homenet.INodeRed>('INodeRed').to(NodeRed).inSingletonScope();

    kernel.bind<Homenet.IZoneManager>('IZoneManager').to(ZoneManager).inSingletonScope();
    kernel.bind<Homenet.ILightsManager>('ILightsManager').to(LightsManager).inSingletonScope();
    kernel.bind<Homenet.ILockManager>('ILockManager').to(LockManager).inSingletonScope();
    kernel.bind<Homenet.IStorageManager>('IStorageManager').to(StorageManager).inSingletonScope();
    kernel.bind<Homenet.ISensorManager>('ISensorManager').to(SensorManager).inSingletonScope();

    // kernel.bind(new TypeBinding<Common>('Common', CommonImpl, TypeBindingScopeEnum.Singleton));
    // kernel.bind(new TypeBinding<LightsManager>("LightsManager", LightsManager, TypeBindingScopeEnum.Transient));
    // kernel.bind(new TypeBinding<BarInterface>("BarInterface", Bar, TypeBindingScopeEnum.Singleton));
    // kernel.bind(new TypeBinding<FooBarInterface>("FooBarInterface", FooBar));
    //
    // // Compilation error: Bar does not implement FooInterface
    // kernel.bind(new TypeBinding<FooInterface>("FooInterface", Bar));
};
