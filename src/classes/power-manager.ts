import { injectable, inject } from 'inversify';
import { Power, AVAILABLE_COMMANDS } from './models/power';
import { SettableClassTypeManager } from '../utils/settable-class-type-manager';

import chalk = require('chalk');

const CLASS_ID = 'power';

@injectable()
export class PowerManager extends SettableClassTypeManager<Homenet.IPower> implements Homenet.IPowerManager {
  constructor(
              @inject('IClassesManager') private classes: Homenet.IClassesManager,
              @inject('ISwitchManager') private switches: Homenet.ISwitchManager,
              @inject('ICommandManager') private commands: Homenet.ICommandManager,
              @inject('IEventBus') private eventBus: Homenet.IEventBus,
              @inject('ILogger') logger: Homenet.ILogger) {
    super(CLASS_ID, classes, logger);

    if (!classes) throw new Error('classes cannot be null');
    if (!switches) throw new Error('switches cannot be null');
    if (!commands) throw new Error('commands cannot be null');
    if (!logger) throw new Error('logger cannot be null');
    if (!eventBus) throw new Error('eventBus cannot be null');
  }

  protected mapSettable(id: string, settable: Homenet.ISettable): Homenet.IPower {
    return new Power(id, settable);
  }

  protected onAddInstance(power: Homenet.IPower, instanceId: string, typeId: string, opts: any) : void {
    const fullId = `${CLASS_ID}.${instanceId}`;
    this.switches.addInstance(fullId, power);
    this.commands.addInstance(fullId, power, AVAILABLE_COMMANDS);
  }
}

