import { injectable, inject } from 'inversify';
import { Hvac, AVAILABLE_COMMANDS } from './models/hvac';
import { SettableClassTypeManager } from '../utils/settable-class-type-manager';

import chalk = require('chalk');

const CLASS_ID = 'hvac';

@injectable()
export class HvacManager extends SettableClassTypeManager<Homenet.IHvac> implements Homenet.IHvacManager {
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

  protected mapSettable(id: string, settable: Homenet.ISettable): Homenet.IHvac {
    return new Hvac(id, settable);
  }

  protected onAddInstance(hvac: Homenet.IHvac, instanceId: string, typeId: string, opts: any) : void {
    const fullId = `${CLASS_ID}.${instanceId}`;
    this.switches.addInstance(fullId, hvac);
    this.commands.addInstance(fullId, hvac, AVAILABLE_COMMANDS);
  }
}

