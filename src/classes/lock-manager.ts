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
    this.getInstance(lockId).set(value);
  }

  protected mapSettable(id: string, settable: Homenet.ISettable): Homenet.ILock {
    return new Lock(id, settable);
  }

  protected onAddInstance(instance: Homenet.ILock, instanceId: string, typeId: string, opts: any) : void {
    const fullId = `${CLASS_ID}.${instanceId}`;
    this.switches.addInstance(fullId, instance);
    this.commands.addInstance(fullId, instance, AVAILABLE_COMMANDS);
  }
}
