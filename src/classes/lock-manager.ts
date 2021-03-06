import { injectable, inject } from 'inversify';
import chalk = require('chalk');

import { SettableClassTypeManager } from '../utils/settable-class-type-manager';
import { Lock, AVAILABLE_COMMANDS } from './models/lock';

const CLASS_ID = 'lock';

@injectable()
export class LockManager extends SettableClassTypeManager<Homenet.ILock> implements Homenet.ILockManager {
  constructor(
      @inject('IClassesManager') private classes: Homenet.IClassesManager,
      @inject('ISwitchManager') private switches: Homenet.ISwitchManager,
      @inject('ICommandManager') private commands: Homenet.ICommandManager,
      @inject('IEventBus') private eventBus: Homenet.IEventBus,
      @inject('IConfig') private config: Homenet.IConfig,
      @inject('ILogger') logger: Homenet.ILogger
    ) {
    super(CLASS_ID, classes, logger);
    logger.info('Started lock manager');
  }

  setLock(lockId: string, value: boolean) : void {
    const instance = this.getInstance(lockId);
    if (instance) instance.set(value);
  }

  protected mapSettable(id: string, settable: Homenet.ISettable, opts: any): Homenet.ILock {
    return new Lock(id, settable, opts);
  }

  protected onAddInstance(instance: Homenet.ILock, instanceId: string, typeId: string, opts: any) : void {
    this.switches.addInstance(instance.switchId, instance);
    this.commands.addInstance(instance.commandId, instance, AVAILABLE_COMMANDS);
  }
}
