import { factory } from './../api/web/v1-test/fixtures/sensors';
import { injectable, inject } from 'inversify';
import chalk = require('chalk');

import { SettableClassTypeManager } from '../utils/settable-class-type-manager';
import { Lock } from './models/lock';

const CLASS_ID = 'lock';
const AVAILABLE_COMMANDS = {
  'lock': {
    "title": "Lock",
    "comment": "Lock the device"
  },
  'unlock': {
    "title": "Unlock",
    "comment": "Unlock the device"
  }
};

@injectable()
export class LockManager extends SettableClassTypeManager<Homenet.ILock> implements Homenet.ILockManager {
  constructor(
      @inject('IClassesManager') private classes: Homenet.IClassesManager,
      @inject('ISwitchManager') private switches: Homenet.ISwitchManager,
      @inject('ICommandManager') private commands: Homenet.ICommandManager,
      @inject('IEventBus') private eventBus: Homenet.IEventBus,
      @inject('IConfig') private config: Homenet.IConfig,
      @inject('ILogger') private logger: Homenet.ILogger
    ) {
    super(CLASS_ID, logger);

    this.addToClasses(classes);
    logger.info('Started lock manager');
  }

  setLock(lockId: string, value: boolean) : void {
    this.getInstance(lockId).set(value);
  }

  protected mapSettable(id: string, settable: Homenet.ISettable): Homenet.ILock {
    return new Lock(id, settable, this.eventBus, this._logger);
  }

  protected onAddInstance(instance: Homenet.ILock, instanceId: string, typeId: string, opts: any) : void {
    const fullId = `${CLASS_ID}.${instanceId}`;
    this.switches.addInstance(fullId, instance);
    this.commands.addInstance(fullId, instance, AVAILABLE_COMMANDS);
  }
}
