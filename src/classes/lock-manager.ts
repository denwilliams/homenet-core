import { injectable, inject } from 'inversify';
import chalk = require('chalk');

import ClassTypeManager = require('../utils/class-type-manager');

const CLASS_ID = 'lock';

@injectable()
class LockManager extends ClassTypeManager<ILock> implements ILockManager {

  private _switches: ISwitchManager;
  private _commands: ICommandManager;
  private _instances: Dict<ILock> = {};

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
      @inject('IClassesManager') classes: IClassesManager,
      @inject('ISwitchManager') switches: ISwitchManager,
      @inject('ICommandManager') commands: ICommandManager,
      @inject('IConfig') config: IConfig,
      @inject('ILogger') logger: ILogger
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

  protected onAddInstance(instance: Func<ILock>, instanceId: string, typeId: string, opts: any) : void {
    this._switches.addInstance(CLASS_ID, instanceId, {id: instanceId});
    this._commands.addInstance(CLASS_ID, instanceId, {id: instanceId});
  }

  private _bindSwitches(switches: ISwitchManager) {
    const self: LockManager = this;
    switches.addType(CLASS_ID, function(opts: {id: string}) : ISwitch {
      return self.getInstance(opts.id);
    });
  }

  private _bindCommands(commands: ICommandManager) {
    const self: LockManager = this;
    commands.addType(CLASS_ID, function(opts) {
      var instance : ILock = self.getInstance(opts.id);
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
