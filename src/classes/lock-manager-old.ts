import {Inject} from 'inversify';
import chalk = require('chalk');

import ClassTypeManager = require('../utils/class-type-manager');

const CLASS_ID = 'lock';

@Inject('IClassesManager', 'ISwitchManager', 'ICommandManager', 'IConfig', 'ILogger')
class LockManager extends ClassTypeManager<ILock> implements ILockManager {

  private _logger: ILogger;
  private _classes: IClassesManager;
  private _switches: ISwitchManager;
  private _commands: ICommandManager;
  private _instances: Dict<ILock> = {};

  /**
   * All lock IDs registered
   * @member {Array<string>} LockManager#ids
   */
  ids: string[] = [];

  /**
   * All locks
   * @member {Array<Lock>} LockManager#all
   */
  all: ILock[] = [];

  locks: Dict<ILock> = {};


  constructor(
    classes: IClassesManager,
    switches: ISwitchManager,
    commands: ICommandManager,
    config: IConfig,
    logger: ILogger) {

    if (!classes) throw new Error('classes cannot be null');
    if (!switches) throw new Error('switches cannot be null');
    if (!commands) throw new Error('commands cannot be null');
    if (!config) throw new Error('config cannot be null');
    if (!logger) throw new Error('logger cannot be null');

    this._classes = classes;
    this._switches = switches;
    this._commands = commands;
    // this._config = config;
    this._logger = logger;

    // this._bindLocks(config);
    logger.info('Starting lock manager');

    this._addClassType(classes);
    this._addSwitchType(switches);
    this._addCommandType(commands);
  }

  _addClassType(classes: IClassesManager) {
    this._logger.info('Adding class type ' + CLASS_ID);
    classes.addClass<ILock>(CLASS_ID, this._addInstance.bind(this));
  }

  _addSwitchType(switches: ISwitchManager) : void {
    this._logger.info('Adding switch type ' + CLASS_ID);
    const self = this;
    switches.addType(CLASS_ID, function(opts: {id:string}) : ILock {
      return self._instances[opts.id];
    });
  }

  _addCommandType(commands: ICommandManager) : void {
    this._logger.info('Adding command type ' + CLASS_ID);
    const self = this;
    commands.addType(CLASS_ID, function(opts: any) {
      var id: string = opts.id;
      var instance: ILock = self._instances[id];
      return {
        turnOn: function() {
          instance.setLock(true);
          instance.set(true);
        },
        turnOff: function() {
          instance.set(false);
        }
      };
    }, null);
  }


  _addInstance(instanceId: string, typeId: string, opts: any): void {
    this._logger.info('Creating light with ID ' + chalk.magenta(instanceId) + ' of type ' + chalk.cyan(typeId));
    this._instances[instanceId] = this._singleton(instanceId, typeId, opts);
    this._switches.addInstance(CLASS_ID, instanceId, {id: instanceId});
    this._commands.addInstance(CLASS_ID, instanceId, {id: instanceId});
  }

    /**
     * Adds a new lock type
     * @method LockManager#addType
     * @param {string} typeId - unique identifier for this type
     * @param {Locker} type - lock implementation
     */
    addType(typeId: string, type: ILock) : void {
      this.locks[typeId] = type;
    }

    /**
     * @method LockManager#setLock
     * @param {string} typeId       - unique ID for this type
     * @param {string} [controllerId] - ID of the specific controller for this type (if any)
     * @param {string} lockId       - ID of this lock
     * @param {string} state        - state to set this lock: lock or unlock
     */
    setLock(typeId: string, controllerId: string, lockId: string, value: boolean) : void {
      this.locks[typeId].setLock(controllerId, lockId, value);
    }

    /**
     * @method LockManager#get
     * @param {string} typeId - lock controller type id
     */
    get(typeId: string): ILock {
      return this.locks[typeId];
    }

  //   _bindLocks(config: IConfig) {
  //     var self = this;
  //     var setLock: SetLockFn = this.setLock.bind(this);
  //     if (!config.locks) return;
  //
  //     config.locks.forEach(function (l: ILockConfig) {
  //       var id: string = l.id;
  //       var set: SetLockFn = this.setLock.bind(this, l.type, l.controller, l.lockId);
  //
  //       /**
  //        * Represents a single lock managed by the {@link LockManager}
  //        * @class Lock
  //        */
  //       var lockObj : ILock = new Lock(id, l.type, setLock);
  //
  //       self[id] = set;
  //       self.ids.push(id);
  //       self.all.push(lockObj);
  //       self.locks[id] = lockObj;
  //     });
  // };
}

interface SetLockFn {
  (type: string, controllerId: string, lockId: string, value: boolean): void
}

// class Lock implements ILock {
//   /**
//    * The unique ID of this lock
//    * @member {string} Lock#id
//    */
//   id: string;
//
//   /**
//    * The type of lock
//    * @member {LockState} Lock#state
//    */
//   state: LockState;
//
//   /**
//    * Sets a new state for a lock
//    * @method Lock#set
//    * @param {string} state - the state to set to: lock or unlock
//    */
//   _set: SetLockFn;
//
//   /**
//    * The type of lock
//    * @member {string} Lock#type
//    */
//   type: string;
//
//   constructor(id: string, type: string, set: SetLockFn) {
//     this.id = id;
//     this.type = type;
//     this._set = set;
//
//     this.state = LockState.unknown;
//   }
//
//   setLock(controllerId: string, lockId: string, value: boolean) : void {
//     return this._set(this.type, controllerId, lockId, value);
//   }
//
//   getType() : string {
//     return this.type;
//   }
// }

export = LockManager;
