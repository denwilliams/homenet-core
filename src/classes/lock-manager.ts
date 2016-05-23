/// <reference path="../interfaces.d.ts"/>

import { injectable, inject } from 'inversify';
// import {Homenet} from '../interfaces.d.ts';
import chalk = require('chalk');

import ClassTypeManager = require('../utils/class-type-manager');

const CLASS_ID = 'lock';

@injectable()
class LockManager extends ClassTypeManager<Homenet.ILock> implements Homenet.ILockManager {

  private _switches: Homenet.ISwitchManager;
  private _commands: Homenet.ICommandManager;
  private _instances: Homenet.Dict<Homenet.ILock> = {};

  // /**
  //  * All lock IDs registered
  //  * @member {Array<string>} LockManager#ids
  //  */
  // ids: string[] = [];

  // /**
  //  * All locks
  //  * @member {Array<Lock>} LockManager#all
  //  */
  // all: ILock[] = [];

  // locks: Dict<ILock> = {};

  constructor(
      @inject('IClassesManager') classes: Homenet.IClassesManager,
      @inject('ISwitchManager') switches: Homenet.ISwitchManager,
      @inject('ICommandManager') commands: Homenet.ICommandManager,
      @inject('IConfig') config: Homenet.IConfig,
      @inject('ILogger') logger: Homenet.ILogger
    ) {
    super(CLASS_ID, logger);

    this.addToClasses(classes);
    this._bindSwitches(switches);
    this._bindCommands(commands);

    this._switches = switches;
    this._commands = commands;
    logger.info('Started lock manager');
  }

  setLock(lockId: string, value: boolean) : void {
    this.getInstance(lockId).set(value);
  }

  protected onAddInstance(instance: Homenet.Func<Homenet.ILock>, instanceId: string, typeId: string, opts: any) : void {
    this._switches.addInstance(CLASS_ID, instanceId, {id: instanceId});
    this._commands.addInstance(CLASS_ID, instanceId, {id: instanceId});
  }

  private _bindSwitches(switches: Homenet.ISwitchManager) {
    const self: LockManager = this;
    switches.addType(CLASS_ID, function(opts: {id: string}) : Homenet.ISwitch {
      return self.getInstance(opts.id);
    });
  }

  private _bindCommands(commands: Homenet.ICommandManager) {
    const self: LockManager = this;
    commands.addType(CLASS_ID, function(opts) {
      var instance : Homenet.ILock = self.getInstance(opts.id);
      return {
        lock: function() {
          instance.set(true);
        },
        unlock: function() {
          instance.set(false);
        }
      };
    }, {
      'lock': {
        "title": "Lock",
        "comment": "Lock the device"
      },
      'unlock': {
        "title": "Unlock",
        "comment": "Unlock the device"
      }
    });
  }

}

export = LockManager;
