import { injectable, inject, multiInject, ContainerModule } from 'inversify';
import * as chalk from 'chalk';
import { EventEmitter } from 'events';

import { App } from './core/app';
import { Common } from './core/common';
import { ClassesManager } from './core/classes-manager';
import { CommandManager } from './core/command-manager';
import { SwitchManager } from './core/switch-manager';
import { SharedEventEmitter } from './core/shared-event-emitter';

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
import { StorageManager } from './core/redis-storage-manager';

// core functions
import { Sunlight } from './core/sunlight';
import { ZoneManager } from './core/zone-manager';

// higher level
import { SensorManager } from './classes/sensor-manager';
import { LightsManager } from './classes/lights-manager';
import { ButtonManager } from './classes/button-manager';
import { LockManager } from './classes/lock-manager';
import { PersonManager } from './classes/person-manager';
import { RedisPersistence } from './core/redis-persistence';

import Core = require('./core/index');

@injectable()
class ConsoleLogger implements Homenet.ILogTarget {
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

@injectable()
class CoreLogger implements Homenet.ILogger {
  private _events: EventEmitter;

  /**
   * Constructor
   */
  constructor(@multiInject('ILogTarget') loggers: Homenet.ILogTarget[]) {
    this._events = new EventEmitter();
    this._events.setMaxListeners(50);
    loggers.forEach(logger => {
      this._bindLogger(logger);
    });
  }

  onLog(handler: Homenet.ILogEventHandler) : void {
    this._events.on('log', handler);
  }

  info(args : any) : void {
    this._log('info', args);
  }
  warn(args : any) : void {
    this._log('warn', args);
  }
  error(args : any) : void {
    this._log('error', args);
  }
  debug(args : any) : void {
    this._log('debug', args);
  }

  private _log(level, args: any) {
    const msg: Homenet.ILogEventMessage = {
      level: level,
      message: args
    };
    this._events.emit('log', msg);
  }

  private _bindLogger(logger: Homenet.ILogTarget) : void {
    this.onLog(msg => {
      switch (msg.level) {
        case 'info':
        case 'debug':
        case 'warn':
        case 'error':
          logger[msg.level](msg.message);
          break;
        default:
          break;
      }
    });
  }
}



@injectable()
class StatsManager implements Homenet.IStatsManager {
  private _eventBus: Homenet.IEventBus;
  private _events: EventEmitter;

  /**
   * Constructor
   */
  constructor(
        @inject('IEventBus') eventBus: Homenet.IEventBus,
        @multiInject('IStatsTarget') targets: Homenet.IStatsTarget[]
        ) {
    this._events = new EventEmitter();
    this._events.setMaxListeners(50);
    targets.forEach(target => {
      this._bindTarget(target);
    });
    this._bindEventBus(eventBus);
  }

  gauge(id: string, value: number) {
    this._events.emit('gauge', {id: id, value: value});
  }

  counter(id: string, value?: number) {
    this._events.emit('counter', {id: id, value: value || 1});
  }

  private _bindTarget(target: Homenet.IStatsTarget) : void {
    this._events.on('gauge', msg => {
      target.gauge(msg.id, msg.number);
    });
    this._events.on('counter', msg => {
      target.counter(msg.id, msg.number);
    });
  }

  private _bindEventBus(eventBus: Homenet.IEventBus) : void {
    eventBus.on('value.*', '*', e => {
      console.log(e);
      // this.gauge(e.id, e.value);
    });
    eventBus.on('trigger.*', 'triggered', e => {
      console.log(e);
      // this.counter(e.id);
    });
  }
}



export const coreModule = new ContainerModule(bind => {
  // bind(new TypeBinding<IConfig>('IConfig', ConfigImpl, TypeBindingScopeEnum.Singleton));
  bind<Homenet.IStatsManager>('IStatsManager').to(StatsManager).inSingletonScope(); //.inTransientScope();
  bind<Homenet.ILogger>('ILogger').to(CoreLogger).inSingletonScope(); //.inTransientScope();
  bind<Homenet.ILogTarget>('ILogTarget').to(ConsoleLogger); //.inTransientScope();
  bind<Homenet.IAuthorizer>('IAuthorizer').to(Authorizer); //.inTransientScope();
  bind<Homenet.IInstanceLoader>('IInstanceLoader').to(InstanceLoader); //.inTransientScope();
  bind<Homenet.ISunlight>('ISunlight').to(Sunlight);

  // these need to be singleton as there is shared state
  bind<Homenet.IClassesManager>('IClassesManager').to(ClassesManager).inSingletonScope();
  bind<Homenet.ICommandManager>('ICommandManager').to(CommandManager).inSingletonScope();
  bind<Homenet.ISwitchManager>('ISwitchManager').to(SwitchManager).inSingletonScope();
  bind<Homenet.ITriggerManager>('ITriggerManager').to(TriggerManager).inSingletonScope();
  bind<Homenet.IValuesManager>('IValuesManager').to(ValuesManager).inSingletonScope();
  bind<Homenet.ISceneManager>('ISceneManager').to(SceneManager).inSingletonScope();
  bind<Homenet.IStateManager>('IStateManager').to(StateManager).inSingletonScope();
  bind<Homenet.IPresenceManager>('IPresenceManager').to(PresenceManager).inSingletonScope();
  bind<Homenet.IEventBus>('IEventBus').to(SharedEventEmitter).inSingletonScope();
  bind<Homenet.IPersistence>('IPersistence').to(RedisPersistence).inSingletonScope();

  bind<Homenet.IWebServer>('IWebServer').to(Core.WebServer);
  bind<Homenet.IApp>('IApp').to(App);


  bind<Homenet.INodeREDContext>('INodeREDContext').to(GlobalContext).inSingletonScope();
  bind<Homenet.INodeRed>('INodeRed').to(NodeRed).inSingletonScope();

  bind<Homenet.IZoneManager>('IZoneManager').to(ZoneManager).inSingletonScope();
  bind<Homenet.IPersonManager>('IPersonManager').to(PersonManager).inSingletonScope();
  bind<Homenet.ILightsManager>('ILightsManager').to(LightsManager).inSingletonScope();
  bind<Homenet.ILockManager>('ILockManager').to(LockManager).inSingletonScope();
  bind<Homenet.IButtonManager>('IButtonManager').to(ButtonManager).inSingletonScope();
  bind<Homenet.IStorageManager>('IStorageManager').to(StorageManager).inSingletonScope();
  bind<Homenet.ISensorManager>('ISensorManager').to(SensorManager).inSingletonScope();

  // kernel.bind(new TypeBinding<Common>('Common', CommonImpl, TypeBindingScopeEnum.Singleton));
  // kernel.bind(new TypeBinding<LightsManager>("LightsManager", LightsManager, TypeBindingScopeEnum.Transient));
  // kernel.bind(new TypeBinding<BarInterface>("BarInterface", Bar, TypeBindingScopeEnum.Singleton));
  // kernel.bind(new TypeBinding<FooBarInterface>("FooBarInterface", FooBar));
  //
  // // Compilation error: Bar does not implement FooInterface
  // kernel.bind(new TypeBinding<FooInterface>("FooInterface", Bar));
});
